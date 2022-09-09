// Model generator
// ask for type - mongodb, postgresql, mysql

import inquirer from "inquirer";
import fs from "fs";

const modelKeys = [];

const questions = [
  {
    type: "list",
    name: "type",
    message: "What DB are you using?",
    default: "MongoDB",
    choices: ["MongoDB", "PostgreSQL", "MySQL"],
    filter(value) {
      return value;
    },
  },
  {
    type: "input",
    name: "fileName",
    message: "What should be the file name?",
    filter(value) {
      return value.includes(".") ? value.split(".")[0] : value;
    },
  },
  {
    type: "list",
    name: "manualGenerateKeys",
    message: "Do you want to continue or add keys to your model?",
    choices: [
      "Continue (Will generate the model with dummy keys)",
      "Add keys to model",
    ],
    filter(value) {
      return value;
    },
  },
];

const modelQuestions = [
  {
    type: "input",
    name: "modelKey",
    message: "Key: ",
  },
  {
    type: "list",
    name: "modelKeyType",
    message: "Type of the key:",
    default: "String",
    choices: ["String", "Integer", "Object", "Array"],
  },
  {
    type: "confirm",
    name: "addMoreKeys",
    message: "Wnat to add more keys (just hit enter for YES)?",
    default: true,
  },
];

// const ui = new inquirer.ui.BottomBar();

inquirer
  .prompt(questions)
  .then((answers) => {
    if (!fs.existsSync("./models")) fs.mkdirSync("./models");
    if (answers?.manualGenerateKeys.includes("Add")) askForKeys(answers);
  })
  .catch((error) => console.error(error));

const askForKeys = async (mainAnswers) => {
  try {
    inquirer.prompt(modelQuestions).then((answers) => {
      if (answers?.addMoreKeys) {
        modelKeys.push(answers);
        askForKeys(mainAnswers);
      } else {
        fs.writeFileSync(
          "./models/model.ts",
          `
        import { Schema, model } from "mongoose";

interface ModelInterface {
  [key: string]: any;
}

const ModelSchema = new Schema<ModelInterface>({
  name: { type: String, default: "" },
});

const Model = model<ModelInterface>("ModelName", ModelSchema);

export default Model;

        
        `
        );
        console.log(modelKeys, mainAnswers);
      }
    });
  } catch (error) {
    console.error(error);
  }
};
