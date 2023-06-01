## Part 1. Team Report (10 points)



### 1.1 Metrics (2 points)

|                                  | Frontend | Backend | Total |
| -------------------------------- | -------- | ------- | ----- |
| Lines of Code                    | 2567     | 4190    | 6757  |
| Number of modules/subprojects    | 9 | 76      | 85 |
| Number of packages               | 1 | 3      | 4 |
| Number of source files           | 41       | 76      | 117   |
| Number of 3rd party dependencies | 59       | 33      | 92    |

Note: In Elixir, Module is a fundamental unit for organizing code. In Elixir, every file is a module, and the file extension is .ex or .exs. There is no mechanism equivalent to the "package" concept in Java. Elixir uses different methods, such as modules and namespaces, to organize code. In our project there are 3 main module `Kerbal`, `Kerbal_Web`, `TrackingStation`. Then the other modules is the submodule of the main module, e.g. `Kerbal.Endpoint`


Tools to get the metrics: `cloc`, `mix`
 `cloc` results:

![image](https://github.com/VSEJGFB/Cnblogs-Theme-SimpleMemory/assets/29839623/535a9df4-42dd-484a-ae4f-a2cb64bcce44)

![image-20230531163552406](https://github.com/VSEJGFB/Cnblogs-Theme-SimpleMemory/assets/29839623/5cb39a5a-1f8f-4da5-ad30-c040ac5b1881)

### 1.2 Documentation (2 points)

- [User Documentaion](https://hackmd.io/@TIeSBeo8T9WrQ35o6IQ6-Q/Bk5oA2EU2): The user document introduces users to how to use our main features, including account management, container creation, CPU/GPU resource scheduling management, container snapshot functionality, and remote GUI window connection.

  <img src="https://raw.githubusercontent.com/zephyrszwc/zephyrs-image/master/202306011926145.png" alt="image-20230601192656038" style="zoom:30%;" />
- [Developer Document](https://hackmd.io/@TIeSBeo8T9WrQ35o6IQ6-Q/B13FV6VI2): The developer document explains how to set up the development environment, including manual configuration from NixOS and configuring by pulling images directly from Docker. It also provides instructions on how to run the frontend and backend, along with some configuration options that need to be modified. Additionally, it explains how to generate the backend API documentation.

  <img src="https://raw.githubusercontent.com/zephyrszwc/zephyrs-image/master/202306011926544.png" alt="image-20230601192608389" style="zoom:30%;" />

### 1.3 Tests (2 points)

#### Frontend

- Our frontend testing tool is Jest. Jest is a widely used JavaScript testing framework developed by Facebook. It offers a simple setup, fast execution, and a comprehensive set of features for testing JavaScript applications. Jest includes built-in matchers, mocking capabilities, snapshot testing, code coverage reports, and extensibility through plugins. It is popular for testing JavaScript codebases of all sizes, including frameworks like React, Vue.js, Angular, and Node.js.

- The test code is at [this link](https://github.com/sustech-cs304/team-project-111/tree/main/kerbal-dashboard/src/components/__tests__).

  - *Source code of related artifact for testing*:

    <img src="https://raw.githubusercontent.com/zephyrszwc/zephyrs-image/master/202306011930913.png" alt="image-20230601193028806" style="zoom:30%;" />

- *Test execution results*:

  ![KPKB) J 1{SJEAS75NMMYVL](https://github.com/VSEJGFB/Cnblogs-Theme-SimpleMemory/assets/29839623/2582bcfb-4910-45cf-93b7-68c3bb456d76)


#### Backend

- Our backend testing tool is **ExUnit**. ExUnit is a unit testing framework for Elixir, a functional programming language built on the Erlang virtual machine. It is the default testing framework that comes with Elixir and provides a robust and easy-to-use testing environment for writing and running tests. Run `mix test --cover` to generate the test cover results.

- The test code for backend is at [this link](https://github.com/sustech-cs304/team-project-111/tree/main/kerbal-backend/test).

  <img src="https://raw.githubusercontent.com/zephyrszwc/zephyrs-image/master/202306012020638.png" alt="image-20230601202008528" style="zoom:30%;" />

- The test results:

<img src="https://github.com/VSEJGFB/Cnblogs-Theme-SimpleMemory/assets/29839623/2ed04cc7-5b7c-4408-a182-98db1e18904c" alt="image" style="zoom:80%;" />

### 1.4 Build (2 points)

#### Frontend

- We use `npm` as frontend package manager, `react` as frontend framework, `create-react-app` as project cli.

- Install dependencies using `npm i`. Compile and build the project using `npm build`.

- After running the build command (`npm build`), the following artifacts are produced:

  - Static files: These can include HTML, CSS, images, and other assets necessary for the application to run.
  - JavaScript files: These contain the compiled and bundled JavaScript code of the React application.

  To run the built project:

  1. After the build process completes, navigate to the `build` directory in your project.
  2. You will find all the static files and JavaScript files in this directory.
  3. Depending on your deployment environment, you can serve these files using a web server or deploy them to a hosting service.

- In the case of using `create-react-app`, the build process is defined in the configuration files provided by the tool itself. These files include the necessary scripts and configurations to execute the build tasks correctly. You can find these files in the root directory of the project, such as `package.json`, `webpack.config.js`, and other related configuration files.

<img src="https://raw.githubusercontent.com/zephyrszwc/zephyrs-image/master/202305312145819.png" alt="image-20230531214513785" style="zoom:80%;" />

### Backend

**The technology/tools/frameworks/approaches that you used for building the project:**

1. **Nix**: Nix is a powerful package manager for Linux and other Unix systems that makes package management reliable and reproducible. It provides atomic upgrades and rollbacks, side-by-side installation of multiple versions of a package, multi-user package management and easy setup of build environments.
2. **Phoenix Framework**: Phoenix is a web framework for Elixir that follows the Model-View-Controller (MVC) architectural pattern. It provides features like routing, controllers, views, channels, and a powerful real-time framework for building scalable and high-performance web applications.
3. **Mix**: Mix is the build tool and task runner for Elixir projects. It handles project compilation, dependency management, test execution, and more. It also provides code generation templates and project scaffolding.



**Explain the tasks executed in a build:**

use `nix build` to build the backend. The tasks executed is following:

1. **Define Dependencies**: The initial set of dependencies (beam, libvirt, pkg-config, and rustPlatform) are defined for the Nix build.

2. **Setup Elixir**: It is setting up the Elixir environment using the Beam programming language's libraries, with the specific Erlang interpreter.

3. **Set Application Details**: It sets up the package name (pname) as "kerbal" and its version as "0.0.1". The source code for the application is located at `./tracking_station`.

4. **Fetch Mix Dependencies**: Using the `fetchMixDeps` function, it fetches the mix dependencies for the Elixir application. A hash of the dependencies is provided to ensure reproducibility.

5. **Setup Rust Environment**: This part sets up the Rust environment to compile a Rust NIF (Native Implemented Function) that interfaces with the Libvirt library. The Rust NIF is located in `./tracking_station/native/libvirt`.

6. **Rust Build Inputs**: Specifies additional inputs needed for the Rust build process. `rustPlatform.bindgenHook` and `pkg-config` are used during the build process. Libvirt is an additional build input.

7. **Creating the Mix Release**: Finally, it builds the Mix release for the Elixir application. It creates a directory for the NIF (Rust Native Implemented Function), links the compiled NIF from the Rust package, and modifies the Elixir code to skip compilation of the NIF since it's already compiled.

   

**Describe the final artifacts produced by a successful build:**

Once a release is assembled, you can start it by calling `bin/RELEASE_NAME start` inside the release. In our project, it will create directory: `./result`

To start the final artifacts, run `./result/bin/tracking_station start` in this directory.

**Buildfile or related artifacts/scripts used for building: [nix build file](https://github.com/sustech-cs304/team-project-111/blob/main/package.nix).**

### 1.5 Deployment (2 points)

**Introduce the containerization technology/tools/frameworks used in your project (0.5 points)**   

In our project, we use Nix for reproducible deployment and package management. Nix is a cross-platform package manager that utilizes a purely functional deployment model where software is installed into unique directories generated through cryptographic hashes. Nix provides a whole build system that allows for building packages in an isolated way. Therefore, we can use Nix to create a reproducible environment on new machine for deployment.

**The script or related artifacts used for containerization (URL links or snapshots). [script link](https://github.com/sustech-cs304/team-project-111/blob/main/flake.nix)**

<img src="https://raw.githubusercontent.com/zephyrszwc/zephyrs-image/master/202306012000619.png" alt="image-20230601200058567" style="zoom:50%;" />

**A proof of successful containerization (0.5 points)**

Due to the direct control of hardware components such as CPU and GPU in our project, we have opted not to use containerization technology like Docker. Instead, we utilize Nix to build a reproducible environment and to deploy.

Run `nix develop .` It will create and enter the reproducible environment.

It will automatically fetch the dependencies to create the environment in a new machine:

![image](https://github.com/VSEJGFB/Cnblogs-Theme-SimpleMemory/assets/29839623/974bcf35-ac1c-4fae-8464-c2367b851453)

After successful creating, the environment is setup. (For example, `rustc` is now in the environment)

![image](https://github.com/VSEJGFB/Cnblogs-Theme-SimpleMemory/assets/29839623/c99cd210-297d-49c7-b62d-9fefc1e56b42)

To start the backend server: `mix setup && mix phx.server` 

#### Frontend

Automatically deploy:  

Please refer to our [github action script](https://github.com/sustech-cs304/team-project-111/blob/main/.github/workflows/check.yml) from ubuntu:20.04 

Simply run `npm i` and `npm build` is all your need to fully compile our frontend.

#### Backend

Automatically deploy:  

Please refer to our github action [script](https://github.com/sustech-cs304/team-project-111/blob/main/.github/workflows/check.yml) from ubuntu:20.04 for host environment. 

Please refer to our backend  [Dokcerfile](https://github.com/sustech-cs304/team-project-111/blob/main/Dockerfile) for setup NixOs image.  

Also please refer to our environment setup [script](https://github.com/sustech-cs304/team-project-111/blob/main/check.sh) for automatically setup deploy environment in target host.  

