

## Getting Started



## Installation

First you need to ensure that you have NodeJS installed.


### Node Version Manager (nvm) \[Optional\]

To easily manage the current version of NodeJS in use on your system NVM is reccomended. 

#### OSX and Linux

The offical NVM repository supports Linux and MacOS. It can be found [here](https://github.com/nvm-sh/nvm).

#### Windows

While there is no official version of nvm for Windows systems there is another project "nvm-windows" which is intended to bring the same functionality to Windows OS. It can be found [here](https://github.com/coreybutler/nvm-windows).

### NodeJS

If you do not want to use NVM the NodeJS package manager can be found [here](https://nodejs.org/en/download/package-manager).


#### Node Packages

Next all of the required packages must be installed.

Navigate to the project directory and run
```sh
npm install
```

## Running the Server

### Development

Simply run the command

```sh
npm run start:dev
```

This will start a development server with the `ts-node` and `nodemon` packages. This allows for easy development via cold-reloading. `ts-node` allows for running the typescript code without the need for compliation while `nodemon` monitors for changes to any `.ts` or `.js` files.

## Testing

Tests are stored in the `test/` directory and end with `*.test.ts`. Testing is done using jest.js and is setup with npm.

To run the current tests run this command from the main top of the project directory
```sh
npm test
```
or
```sh
npm run test
```

### Production





