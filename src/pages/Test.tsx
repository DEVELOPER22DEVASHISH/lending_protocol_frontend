// src/pages/Test.tsx
import React from "react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
const Test: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Component Test Page</h1>
      <div>
  <h2 className="text-lg font-semibold mb-2">Cards</h2>
  <Card title="Example Card">
    <p>This is a sample card component with some content.</p>
    <Button className="mt-4">Card Action</Button>
  </Card>
</div>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Buttons</h2>
          <div className="flex gap-2">
            <Button>Primary Button</Button>
            <Button primary={false}>Secondary Button</Button>
            <Button disabled>Disabled Button</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
