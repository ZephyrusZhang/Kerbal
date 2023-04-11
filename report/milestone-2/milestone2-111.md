<font size=6><b>[CS304] Requirement Modeling & DesignReport</b></font>

> Project Name: Kerbla
>
> Project Member: 黄北辰，邬一帆，余乃蔚，刘晟淇，张闻城

[toc]

# 1. Requirements Modeling & Design

## 1.1 Use Case Diagram

![User Case Diagram](https://raw.githubusercontent.com/zephyrszwc/zephyrs-image/master/202304091413750.png)

## 1.2 Swimlane Diagram

![image-20230410224433739](https://raw.githubusercontent.com/Nam-dada/dk_image/master/image-20230410224433739.png)

## 1.3 Natural Language Description

> User case name: Create Virtual Environment
>
> Participant: User
>
> Goal: To enable users to specify an operating system image and their required GPU/CPU resource quantities, and choose an OS snapshot to create a virtual operating system with pre-existing package or environment setups.
>
> Entry Condition: User is logged into the system and has access to the virtual machine creation interface.
>
> Trigger Condition: User selects the option to create a new virtual machine.
>
> Main Scene:
>
> - User selects the operating system image they wish to use.
> - User specifies the required GPU/CPU resource quantities for their virtual machine.
> - User selects an OS snapshot to create their virtual operating system from.
> - System creates a virtual machine with the specified operating system image and GPU/CPU resources.
>
> Other Scene:
>
> - User can customize the virtual machine configuration further, such as adding additional packages or adjusting resource allocation.
> - User can save the virtual machine configuration as an OS snapshot for future use.
>
> Exception Scene:
>
> - Invalid operating system image or GPU/CPU resource quantity is specified, system prompts user to correct inputs.
> - Invalid OS snapshot is selected, system prompts user to select a valid snapshot or create a new one.



### 1.3.1 User Role

We have two roles in this project, normal user and administrator. Since our project is a GPU/CPU allocation scheduling management system that can be deployed on the server by the users themselves, we don't want anyone to be able to register an account at will. In our system, only the administrator has the power to create normal users. This means that to gain access to the system, a user must first contact the administrator and request an account. The administrator can then create an account for the user and provide them with the necessary login credentials.

Once a user has access to the system, they can use it to manage GPU/CPU allocation scheduling on their server. The system allows users to allocate resources to different tasks, monitor resource usage, and manage job queues.

### 1.3.2 Container Creation

In our system, users have the ability to specify an operating system image along with their required GPU/CPU resource quantities via a user case diagram. Additionally, users can choose which OS snapshot to create their virtual operating system from. This allows for the creation of a virtual OS with pre-existing package or environment setups. For instance, a user with scientific computation tasks in mind can create a virtual OS from an OS snapshot preloaded with Anaconda, PyTorch, Sci-kit, and other scientific computation packages. It is worth noting that the OS snapshot can be either pre-customized by developers or uploaded by users themselves. This feature enhances the flexibility of the system, enabling users to tailor their virtual environment to their specific needs. Ultimately, this capability streamlines the user's workflow, saving time and effort while increasing efficiency.

### 1.3.3 Adminstrator

In addition to user creation, our system provides administrators with the authority to force stop or delete normal users. This feature has been included to safeguard against the possibility of malicious or unscrupulous individuals misusing the system's resources for unlawful activities, such as mining or utilizing computing resources to play video games.

By granting administrators the power to force stop or delete such users, the system ensures that computing resources are utilized for their intended purposes and that the overall integrity of the system is preserved. This feature empowers administrators to take swift action when necessary, safeguarding the system and its users against potential harm or exploitation.

Furthermore, this capability serves as a vital security measure, preventing unauthorized or inappropriate use of computing resources and protecting the system's assets from misuse or damage. Ultimately, this feature reinforces the system's security and stability, ensuring that it remains a reliable and trustworthy tool for its intended purposes.

## 1.4 Diagrams for Logical view

- Class Diagram

  Since we are using **elixir** as our backend programming language, which is a functional, not object-oriented programming language, thus there is no class concept in our backend system. So we don't provide any class diagram here.

- Component Diagram

  ![Untitled.vpd (1)](https://raw.githubusercontent.com/zephyrszwc/zephyrs-image/master/202304111101427.png)

## 1.5 Data Design

<img src="https://raw.githubusercontent.com/zephyrszwc/zephyrs-image/master/202304101855907.png" alt="users_tokens" style="zoom:30%;" />

The database we will use in this project is listed above. 

The `users` table is a fundamental component of our database architecture, serving as a repository for user account information, such as usernames, email addresses, and password hashes. This information is essential for authentication and authorization purposes, enabling our system to verify the identity of users and control access to various system resources.

Additionally, the `users_toke`n table is a critical element of our database design, responsible for storing a variety of tokens utilized throughout the system, such as session tokens for login, tokens for email authentication, and tokens for password reset. By leveraging this table, we can maintain a secure and efficient token management system, ensuring that sensitive information is protected and user accounts remain secure.

Despite the relative simplicity of our database design, we have made deliberate choices to optimize performance and scalability. Given the dynamic nature of GPU/CPU resource scheduling and other critical system information, we have elected not to store this data in the database. Instead, we have implemented mechanisms for retrieving this information directly from the user's virtual machine via command line interfaces and other methods, thereby maximizing system efficiency and minimizing potential performance bottlenecks.

Overall, our database design represents a carefully considered balance between functionality, performance, and security, enabling our system to provide robust and reliable services to our users.

## 1.6 UI Design

- Welcome page

  ![image-20230409172638127](https://raw.githubusercontent.com/zephyrszwc/zephyrs-image/master/202304091726363.png)

- Sign in page

  ![image-20230409172244396](https://raw.githubusercontent.com/zephyrszwc/zephyrs-image/master/202304092013152.png)

- Sign up page

  ![image-20230410113052823](https://raw.githubusercontent.com/zephyrszwc/zephyrs-image/master/202304101131342.png)

# 2. Collaborations

- Git graph

  <img src="https://raw.githubusercontent.com/zephyrszwc/zephyrs-image/master/202304101206119.png" alt="2023-04-10_120501" style="zoom:50%;" />

- Contribution stats:

       Git commits per author:
       
               30  ZephyrusZhang           58.9%
               14  Bill Huang              27.5%
               5   Frank                   9.8%
               1   github-classroom[bot]   2.0%
               1   dkRose                  2.0%
   

# 3. Deliverables

Our system has made significant progress towards delivering a secure and functional user authentication and authorization system. Specifically, we have implemented critical features such as user registration, email verification sending, and user login functionality, enabling users to create and access their accounts with ease and confidence.

In addition, we have integrated these features with the front-end of our system, providing users with a streamlined and intuitive interface for interacting with our system. We have also implemented route guarding mechanisms, ensuring that only authenticated users can access pages other than the login page, enhancing system security and reducing the risk of unauthorized access.

Furthermore, we have established a robust connection between the front and back ends of our system, enabling seamless communication between the client and server components. We have rigorously tested these features and functionalities, ensuring that they meet our high standards for reliability, performance, and security.



Project structure

<img src="https://raw.githubusercontent.com/zephyrszwc/zephyrs-image/master/202304101212892.png" alt="2023-04-10_121203" style="zoom:80%;" />
