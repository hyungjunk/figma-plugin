// This plugin will generate a sample codegen plugin
// that appears in the Element tab of the Inspect panel.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

enum NodeNames {
  Dropdown = "Dropdown",
  Lozenge = "Lozenge",
  Button = "Button",
  Input = "Text input",
  Tab = "Tab",
  Link = "Link",
  RadioButton = "Radio button",
}

function toCamelCase(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      if (index === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join("");
}

const getVariantProperties = ({ name, props }) => {
  if (name === NodeNames.Lozenge) {
    console.log(props);
    return {
      color: props.Color.toLowerCase(),
    };
  }
  if (name === NodeNames.Dropdown) {
    return {
      size: props.Size.toLowerCase(),
    };
  }
  if (name === NodeNames.Button) {
    return {
      buttonType: props.Level.toLowerCase(),
      size: props.Size.toLowerCase(),
    };
  }
  if (name === NodeNames.Input) {
    return {
      size: props.Size.toLowerCase(),
    };
  }
  if (name === NodeNames.Tab) {
    return {
      size: props.Size.toLowerCase(),
    };
  }
  if (name === NodeNames.Link) {
    return {
      size: props.Size.toLowerCase(),
    };
  }
  if (name === NodeNames.RadioButton) {
    return {};
  }
};

// it traverses the node and gets the textContent from its property.
// Get the text from its property children[0].character
const traverseNodeAndGetCharacter = (node: SceneNode) => {
  if (node.type === "TEXT") {
    return node.characters;
  }
  if ("children" in node) {
    return node.children
      .map((child) => traverseNodeAndGetCharacter(child))
      .join("");
  }
  return "";
};

const generateCode = (node: InstanceNode) => {
  const props = getVariantProperties({
    name: node.name,
    props: node.variantProperties,
  });
  if (node.name === NodeNames.Lozenge) {
    const text = traverseNodeAndGetCharacter(node);
    return `import { Lozenge } from 'feather/lib/components/lozenge';
<Lozenge variant={LozengeVariant.Light} color="${props.color}" />
  ${text}
</Lozenge>`;
  }
  //   if (node.name === NodeNames.Dropdown) {
  //     return `import { Dropdown } from 'feather/lib/components/dropdown';
  // <Dropdown
  //   size="${props.size}"
  //   items={[{
  //     value:'value',
  //     label:'label',
  //     render: ()=><div>hi!</div>
  //   }]}
  //   itemToElement={item.render}
  // />`;
  //   }
  if (node.name === NodeNames.Button) {
    const text = traverseNodeAndGetCharacter(node);
    return `import { Button } from 'feather/lib/components/button';
<Button buttonType="${toCamelCase(props.buttonType)}" size="${props.size}" 
  onClick={() => {}}
>
  ${text}
</Button>`;
  }
  //   if (node.name === NodeNames.Input) {
  //     return `import { InputText } from 'feather/lib/components/input';
  // <InputText size="${props.size}" label="label" />`;
  //   }
  //   if (node.name === NodeNames.Tab) {
  //     return `import { TabMenu } from '@ui/components/tabMenu';
  // const MyTab = () => {
  // const [activeTab, setActiveTab] = useState(0);
  // return <TabMenu
  //   css="padding: 24px 0px;"
  //   tabs={[
  //     { value: 'local', label: 'For testing (temporary)' },
  //     { value: 'published', label: 'Recently applied' },
  //   ]}
  //   hasBorder={true}
  //   activeTab={activeTab}
  //   handleTabClick={(tabIndex) => setActiveTab(tabIndex)}
  // />
  //   };`;
  //   }
  //   if (node.name === NodeNames.Link) {
  //     return `import { Link } from 'feather/lib/components/link';
  // <Link size="${props.size}" href="https://www.feather.com" target="_blank" />`;
  //   }
  //   if (node.name === NodeNames.RadioButton) {
  //     return `import { RadioButton } from 'feather/lib/components/radio';
  // <Radio
  //   checked={state === 'light'}
  //   label={
  //     <Flex.Row>
  //       <span css="margin-bottom: 8px;">{t('style.widget.theme.light.label')}</span>
  //     </Flex.Row>
  //   }
  //   disabled={false}
  //   value="light"
  //   onChange={(e) => {}}
  // />`;
  //   }
};

// This provides the callback to generate the code.
figma.codegen.on("generate", (event) => {
  console.log("running");
  const { node } = event;
  console.log(node);
  // console.log(node.name);
  // console.log(node.variantProperties);
  const code = generateCode(node as InstanceNode);
  return [
    {
      language: "PLAINTEXT",
      code: code,
      title: "Codegen Plugin",
    },
  ];
});
