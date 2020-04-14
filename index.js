let inquirer = require("inquirer");
let fs = require("fs");
let path = require("path");

let axios = require("axios");





const questions = [
  {
    type: "input",
    name: "github",
    message: "What is your GitHub username?",
  },
  {
    type: "input",
    name: "title",
    message: "What is your project's name?",
  },
  {
    type: "input",
    name: "description",
    message: "Please write a short description of your project",
  },
  {
    type: "list",
    name: "license",
    message: "What kind of license should your project have?",
    choices: ["MIT", "APACHE 2.0", "GPL 3.0", "BSD 3", "None"],
  },
  {
    type: "input",
    name: "installation",
    message: "What command should be run to install dependencies?",
    default: "npm i",
  },
  {
    type: "input",
    name: "test",
    message: "What command should be run to run tests?",
    default: "npm test",
  },
  {
    type: "input",
    name: "usage",
    message: "What does the user need to know about using the repo?",
  },
  {
    type: "input",
    name: "contributing",
    message: "What does the user need to know about contributing to the repo?",
  },
];

//inquirer.prompt(questions);
startQuestion();
//1 we need api file that calls github
function startQuestion() {
    inquirer
        .prompt(questions)
        .then(function (userResponse) {
            const queryUrl = `https://api.github.com/users/${userResponse.github}`;

            axios.get(queryUrl).then(function (res) {

                let combinedData = { ...userResponse, ...res.data };

                let readmeFileTemp = generateMarkdown(combinedData)

                writeToFile("ReadMeFile.md", readmeFileTemp);

            });
        });
}
//2 we need file that generates readme markup

//3- method that read the fine and writes
//4collect user response and also gihub api response and  make file off  that



function writeToFile(fileName, data) {
  return fs.writeFileSync(path.join(fileName), data);
}


function generateMarkdown(data) {
  const projectTitle = data.title.toLowerCase().split(" ").join("-");
  let projectUrl = `https://github.com/${data.github}/${projectTitle}`;
  let license = "";
  let licenseBadge = "";

  if (data.license !== "None") {
    licenseBadge = `[![GitHub license](https://img.shields.io/badge/license-${data.license}-blue.svg)](${projectUrl})`;
    license = `## License

    This project is licensed under the ${license} license.`;
  }

  return `
# ${data.title}
${licenseBadge}

## Description

${data.description}

## Table of Contents

* [Installation](#installation)

* [Usage](#usage)

* [License](#license)

* [Contributing](#contributing)

* [Tests](#tests)

* [Questions](#questions)

## Installation

To install necessary dependencies, run the following command:

\`\`\`
${data.installation}
\`\`\`

## Usage

${data.usage}

${license}

## Contributing

${data.contributing}

## Tests

To run tests, run the following command:

\`\`\`
${data.test}
\`\`\`

## Questions

<img src="${data.avatar_url}" alt="avatar" style="border-radius: 16px" width="30" />

If you have any questions about the repo, open an issue or contact [${data.github}](${data.url}) directly at ${data.email}.

`;
}


