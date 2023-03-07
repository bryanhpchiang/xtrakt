import requests
from bs4 import BeautifulSoup
from pydantic import BaseModel
import re
import modal
from langchain.text_splitter import TokenTextSplitter
import openai


stub = modal.Stub("xtrakt")
image = modal.Image.debian_slim().pip_install(
    ["requests", "bs4", "langchain", "tiktoken", "openai"]
)


class Item(BaseModel):
    url: str
    attributes: str
    sk: str


@stub.webhook(method="POST", image=image)
def process(item: Item):
    try:
        results = extract.call(item.url, item.attributes)
    except Exception as e:
        return {
            "error": str(e),
        }
    return {
        "results": results,
    }


def flatten(l):
    return [item for sublist in l for item in sublist]


@stub.function(image=image)
def extract(url, attributes):
    text = get_text.call(url)
    # chunk it up
    text_splitter = TokenTextSplitter(chunk_size=3000, chunk_overlap=200)
    chunks = text_splitter.split_text(text)
    print(f"got {len(chunks)} chunks.")

    # just in case the webpage is really long
    chunks = chunks[:10]

    results = list(extract_chunk.map([(c, attributes) for c in chunks]))
    results = flatten([r.split("\n") for r in results])
    print(results)

    return results


@stub.function(image=image, secret=modal.Secret.from_name("openai"))
def extract_chunk(inp):
    chunk, attributes = inp
    prompt = f"""{chunk}

Extract the following columns from the text above. If the column value is unknown or missing, leave it blank.
Do not be distracted by irrelevant information.
Output your result in CSV format (1 entry per line) but with | as the separator.
{attributes}
"""
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        temperature=0.7,
        max_tokens=512,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
    )
    return response.choices[0].text.strip()


@stub.function(image=image)
def get_text(url):
    # get the text
    page = requests.get(url)
    gfg = BeautifulSoup(page.text)
    text = gfg.get_text()
    text = re.sub("\n+", "\n", text)
    return text


if __name__ == "__main__":
    with stub.run():
        url = "https://www.missionpeakpediatricdentistry.com/"
        attributes = "company_name,phone_number,location_name,street_1,street_2,city,state,zip,country,email_2,fax_number"
        url = "https://en.wikipedia.org/wiki/The_Diamond_Age"
        attributes = "invention_name|description"
        result = extract.call(
            url,
            attributes,
        )
