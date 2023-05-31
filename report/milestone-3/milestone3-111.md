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

- Our frontend testing tool is ExUnit. ExUnit is a unit testing framework for Elixir, a functional programming language built on the Erlang virtual machine (BEAM). It is the default testing framework that comes with Elixir and provides a robust and easy-to-use testing environment for writing and running tests. Run `mix test --cover` to generate the test cover results.

- The test code for backend is at [this link](https://github.com/sustech-cs304/team-project-111/tree/main/kerbal-backend/test).

- The test results:

<img src="https://github.com/VSEJGFB/Cnblogs-Theme-SimpleMemory/assets/29839623/2ed04cc7-5b7c-4408-a182-98db1e18904c" alt="image" style="zoom:80%;" />

### 1.4 Build (2 points)



Backend:

The technology/tools/frameworks/approaches that you used for building the project:

1. **Nix**: Nix is a powerful package manager for Linux and other Unix systems that makes package management reliable and reproducible. It provides atomic upgrades and rollbacks, side-by-side installation of multiple versions of a package, multi-user package management and easy setup of build environments.
2. **Phoenix Framework**: Phoenix is a web framework for Elixir that follows the Model-View-Controller (MVC) architectural pattern. It provides features like routing, controllers, views, channels, and a powerful real-time framework for building scalable and high-performance web applications.
3. **Mix**: Mix is the build tool and task runner for Elixir projects. It handles project compilation, dependency management, test execution, and more. It also provides code generation templates and project scaffolding.



Explain the tasks executed in a build:

use `nix build` to build the backend. The tasks executed is following:

1. **Define Dependencies**: The initial set of dependencies (beam, libvirt, pkg-config, and rustPlatform) are defined for the Nix build.

2. **Setup Elixir**: It is setting up the Elixir environment using the Beam programming language's libraries, with the specific Erlang interpreter.

3. **Set Application Details**: It sets up the package name (pname) as "kerbal" and its version as "0.0.1". The source code for the application is located at `./tracking_station`.

4. **Fetch Mix Dependencies**: Using the `fetchMixDeps` function, it fetches the mix dependencies for the Elixir application. A hash of the dependencies is provided to ensure reproducibility.

5. **Setup Rust Environment**: This part sets up the Rust environment to compile a Rust NIF (Native Implemented Function) that interfaces with the Libvirt library. The Rust NIF is located in `./tracking_station/native/libvirt`.

6. **Rust Build Inputs**: Specifies additional inputs needed for the Rust build process. `rustPlatform.bindgenHook` and `pkg-config` are used during the build process. Libvirt is an additional build input.

7. **Creating the Mix Release**: Finally, it builds the Mix release for the Elixir application. It creates a directory for the NIF (Rust Native Implemented Function), links the compiled NIF from the Rust package, and modifies the Elixir code to skip compilation of the NIF since it's already compiled.

   

Describe the final artifacts produced by a successful build:

Once a release is assembled, you can start it by calling `bin/RELEASE_NAME start` inside the release. In our project, it will create directory: `./result`

To start the project, run `./result/bin/tracking_station start` in this directory.



Buildfile or related artifacts/scripts used for building: [nix build file](https://github.com/sustech-cs304/team-project-111/blob/main/package.nix).

