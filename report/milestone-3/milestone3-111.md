## Part 1. Team Report (10 points)



### 1.1 Metrics (2 points)

|                                  | Frontend | Backend | Total |
| -------------------------------- | -------- | ------- | ----- |
| Lines of Code                    | 2567     | 4190    | 6757  |
| Number of modules/subprojects    |          | 76      |       |
| Number of packages               |          |         |       |
| Number of source files           | 41       | 76      | 117   |
| Number of 3rd party dependencies | 59       | 33      | 92    |



 `cloc` results:

![image](https://github.com/VSEJGFB/Cnblogs-Theme-SimpleMemory/assets/29839623/535a9df4-42dd-484a-ae4f-a2cb64bcce44)

![image-20230531163552406](https://github.com/VSEJGFB/Cnblogs-Theme-SimpleMemory/assets/29839623/5cb39a5a-1f8f-4da5-ad30-c040ac5b1881)



### 1.3 Tests (2 points)

Frontend:

- Our frontend testing tool is Jest. Jest is a widely used JavaScript testing framework developed by Facebook. It offers a simple setup, fast execution, and a comprehensive set of features for testing JavaScript applications. Jest includes built-in matchers, mocking capabilities, snapshot testing, code coverage reports, and extensibility through plugins. It is popular for testing JavaScript codebases of all sizes, including frameworks like React, Vue.js, Angular, and Node.js.

- The test code is at [this link](https://github.com/sustech-cs304/team-project-111/tree/main/kerbal-dashboard/src/components/__tests__).

- The test results:

  ![KPKB) J 1{SJEAS75NMMYVL](https://github.com/VSEJGFB/Cnblogs-Theme-SimpleMemory/assets/29839623/2582bcfb-4910-45cf-93b7-68c3bb456d76)



Backend:

- Our frontend testing tool is ExUnit. ExUnit is a unit testing framework for Elixir, a functional programming language built on the Erlang virtual machine (BEAM). It is the default testing framework that comes with Elixir and provides a robust and easy-to-use testing environment for writing and running tests.

- The test code for backend is at [this link](https://github.com/sustech-cs304/team-project-111/tree/main/kerbal-backend/test).

- The test results:



### 1.4 Build (2 points)



Backend:

The technology/tools/frameworks/approaches that you used for building the project:

1. Phoenix Framework: Phoenix is a web framework for Elixir that follows the Model-View-Controller (MVC) architectural pattern. It provides features like routing, controllers, views, channels, and a powerful real-time framework for building scalable and high-performance web applications.
2. Mix: Mix is the build tool and task runner for Elixir projects. It handles project compilation, dependency management, test execution, and more. It also provides code generation templates and project scaffolding.



Explain the tasks executed in a build

use `mix release` to build the backend. The tasks executed is following:

1. **Compiling the application**: The first step in the release process is compiling your application's source code, including any dependencies, into bytecode.

2. **Building the application release**: This involves generating a directory structure that follows the OTP release standard and copying over the compiled bytecode. This structure includes all the application's runtime dependencies, including the Elixir and Erlang/OTP runtimes.

3. **Creating start scripts**: As part of the release, `mix release` generates scripts for starting the application. These scripts set up the necessary environment variables and boot the Erlang VM with your application's code.

   

Describe the final artifacts produced by a successful build

Once a release is assembled, you can start it by calling `bin/RELEASE_NAME start` inside the release. In our project, it will create directory: `_build/dev/rel/kerbal/`

To start the project, run `/bin/kerbal start` in this directory.



