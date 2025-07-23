import getTitle from "@/utils/get-title";
import { createSignal, For, onMount } from "solid-js";
import { useMetadata } from "vike-metadata-solid";

const TEMPLATE_EXAMPLES = [
  {
    label: "Favorite Engine",
    template: "My favorite template engine is {{it.favorite}}.",
    data: "{ favorite: 'Squirrelly, definitely' }",
  },
  {
    label: "Greeting",
    template: "Hello, {{it.name}}!",
    data: "{ name: 'World' }",
  },
  {
    label: "Simple Math",
    template: "2 + 2 = {{it.sum * 2 / 2}}",
    data: "{ sum: 4 }",
  },
  {
    label: "Conditional",
    template:
      "{{@if(it.maritalStatus === 'single')}}\nSingle\n{{#elif(it.maritalStatus === 'married')}}\nMarried\n{{#else}}\nUnknown\n{{/if}}",
    data: "{ maritalStatus: 'married' }",
  },
  {
    label: "Loop",
    template: "{{@each(it.fruits) => fruit}}\n\n- {{fruit}}\n\n{{/each}}",
    data: "{fruits: ['apple', 'banana', 'cherry']}",
  },
];

export default function Page() {
  let json5: any;
  let render: (template: any, data: any) => string = () => "";

  onMount(async () => {
    const _json5 = await import("json5");
    // @ts-ignore (I specifically use the browser/squirrelly.min.js build because I'm running this on the browser + es.js and cjs.js use require("fs") so that's bad).
    const _sqrl = await import("squirrelly/dist/browser/squirrelly.min.js");
    json5 = _json5.default;
    render = _sqrl.render;

    const initialExample = TEMPLATE_EXAMPLES[0];
    setTemplate(initialExample.template);
    setDataString(initialExample.data);
    setTimeout(() => {
      handleRender();
    }, 400);
  });
  useMetadata({
    title: getTitle("Demo"),
  });

  const [template, setTemplate] = createSignal<string>("");
  const [dataString, setDataString] = createSignal<string>("{favorite: 'Squirrelly'}");
  const [result, setResult] = createSignal<string>("");

  const handleExampleChange = (e: any) => {
    const selectedExample = TEMPLATE_EXAMPLES[e.target.value];
    setTemplate(selectedExample.template);
    setDataString(selectedExample.data);
  };

  const handleRender = () => {
    try {
      console.log("clicked.1", json5);
      const data = json5.parse(dataString());
      console.log("data", data);
      const rendered = render(template(), data);
      console.log("rendered", rendered);
      setResult(rendered);
      console.log("clicked.2");
      return rendered;
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  };

  return (
    <>
      <div class="flex flex-col gap-5 items-center h-screen bg-gray-50 ">
        <div class="w-full space-y-4 px-5 text-center py-5">
          <h1 class="text-3xl font-bold text-gray-800">Squirrelly Demos</h1>
          <p class="text-gray-600">
            The fastest way to learn Squirrelly with interactive examples!
          </p>
        </div>
        <div class="flex flex-col md:flex-row gap-6 w-full p-6 rounded-lg ">
          <div class="w-full md:w-1/2 space-y-4">
            <select
              onChange={handleExampleChange}
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <For each={TEMPLATE_EXAMPLES}>
                {(example, index) => (
                  <option value={index()} class="p-2">
                    {example.label}
                  </option>
                )}
              </For>
            </select>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Template:</label>
              <textarea
                value={template()}
                onChange={(e) => setTemplate(e.target.value)}
                class="w-full p-3 h-48 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Data:</label>
              <textarea
                value={dataString()}
                onChange={(e) => setDataString(e.target.value)}
                class="w-full p-3 h-48 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleRender}
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Render
            </button>
          </div>

          <div class="w-full md:w-1/2 space-y-2">
            <label class="block text-sm font-medium text-gray-700">Result:</label>
            <textarea
              value={result()}
              readOnly
              class="w-full p-3 h-96 border border-gray-300 rounded-md bg-gray-100 font-mono text-sm"
            />
          </div>
        </div>
      </div>
    </>
  );
}
