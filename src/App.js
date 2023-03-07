import { useState, useEffect } from "react";

function App() {
  const [results, setResults] = useState([]);
  const [attributes, setAttributes] = useState("");

  // form stuff
  const [attr, setAttr] = useState("");
  const [url, setUrl] = useState("");
  const [sk, setSK] = useState("");
  const [hide, setHide] = useState(false);

  useEffect(() => {
    // console.log(results);
  }, [results]);
  return (
    <div className="p-4 min-h-screen bg-slate-50 flex w-9/10 flex-col w-screen md:flex-row md:justify-center md:space-x-8 pt-8">
      <div className="flex flex-col w-full md:w-1/3 items-center">
        <div className="text-3xl font-bold mb-2">xtrakt</div>
        <div className="text-zinc-500">
          get structured data from any website
        </div>

        <div className="flex flex-col w-full space-y-4 mt-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
              onClick={() => setHide(!hide)}
            >
              openai key
            </label>
            {!hide && (
              <div className="mt-1">
                <input
                  value={sk}
                  onChange={(e) => setSK(e.target.value)}
                  type="text"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="sk-[....]"
                />
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              url
            </label>
            <div className="mt-1">
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                type="text"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="https://wikipedia.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              attributes
            </label>
            <div className="mt-1">
              <input
                value={attr}
                onChange={(e) => setAttr(e.target.value)}
                type="text"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="company_name|phone_number"
              />
            </div>
          </div>
        </div>

        <div
          className="flex flex-col mt-4"
          onClick={async () => {
            // get the shit
            console.log(attr.split("|"));
            const data = await fetch(
              "https://bryanhpchiang--xtrakt-process.modal.run/",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  url,
                  attributes: attr,
                  sk,
                }),
              }
            ).then((r) => r.json());
            console.log("got some stuff back");
            const { results } = data;
            console.log(`this is attr: ${attr}`);
            setAttributes(attr);

            setResults(results);
          }}
        >
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            get the stuff
          </button>
        </div>

        {attributes.length > 0 && (
          <div className="mt-8 flow-root">
            <div className="-my-2 -mx-6 overflow-x-auto lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      {attributes.split("|").map((name, i) => {
                        console.log(attributes);
                        if (i > 0) {
                          return (
                            <th
                              scope="col"
                              className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                            >
                              {name}
                            </th>
                          );
                        } else {
                          return (
                            <th
                              scope="col"
                              className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                            >
                              {name}
                            </th>
                          );
                        }
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {results.map((result) => (
                      <tr>
                        {result.split("|").map((value, i) => {
                          if (i > 0) {
                            return (
                              <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                                {value.slice(0, 200)}
                                {value.length > 200 && "..."}
                              </td>
                            );
                          } else {
                            return (
                              <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm text-gray   sm:pl-0">
                                {value.slice(0, 200)}
                                {value.length > 200 && "..."}
                              </td>
                            );
                          }
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
