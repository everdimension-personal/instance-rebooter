import { type MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Lightsail Rebooter
        </h1>
        <Form method="post">
          <button>submit</button>
        </Form>
      </div>
    </div>
  );
}
