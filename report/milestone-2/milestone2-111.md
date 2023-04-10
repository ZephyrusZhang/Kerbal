<font size=6><b>[CS304] Requirement Modeling & DesignReport</b></font>

> Project Name: Kerbla
>
> Project Member: 黄北辰，邬一帆，余乃蔚，刘晟淇，张闻城

[toc]

# 1. Requirements Modeling & Design

## 1.1 Use Case Diagram

![User Case Diagram](https://raw.githubusercontent.com/zephyrszwc/zephyrs-image/master/202304091413750.png)

## 1.2 Swimlane Diagram

![Swimlane Diagram](https://raw.githubusercontent.com/zephyrszwc/zephyrs-image/master/202304091413802.png)

## 1.3 Natural Language Description

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

## 1.5 Data Design



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

- Contribution stats (by author) on the current branch:

       Frank Wu <56958034+GhostFrankWu@users.noreply.github.com>:
        insertions:    1      (0%)
        deletions:     0      (0%)
        files:         1      (0%)
        commits:       1      (2%)
        lines changed: 1      (0%)
        first commit:  Thu Mar 9 18:28:03 2023 +0800
        last commit:   Thu Mar 9 18:28:03 2023 +0800
          
       zephyrus <2996362441@qq.com>:
        insertions:    25     (0%)
        deletions:     2      (0%)
        files:         2      (1%)
        commits:       1      (2%)
        lines changed: 27     (0%)
        first commit:  Sun Apr 9 20:09:57 2023 +0800
        last commit:   Sun Apr 9 20:09:57 2023 +0800
          
       Frank <FrankssWu@outlook.com>:
        insertions:    588    (2%)
        deletions:     120    (11%)
        files:         17     (8%)
        commits:       4      (8%)
        lines changed: 708    (3%)
        first commit:  Sat Mar 25 19:08:18 2023 +0800
        last commit:   Sun Apr 9 19:58:01 2023 +0800
          
       ZephyrusZhang <2996362441@qq.com>:
        insertions:    19746  (76%)
        deletions:     724    (65%)
        files:         72     (33%)
        commits:       22     (46%)
        lines changed: 20470  (75%)
        first commit:  Wed Mar 15 20:22:20 2023 +0800
        last commit:   Sun Apr 9 23:53:55 2023 +0800
          
       Zephyrus <82928147+ZephyrusZhang@users.noreply.github.com>:
        insertions:    233    (1%)
        deletions:     57     (5%)
        files:         5      (2%)
        commits:       5      (10%)
        lines changed: 290    (1%)
        first commit:  Sun Mar 12 18:29:21 2023 +0800
        last commit:   Mon Mar 13 11:33:26 2023 +0800
          
       Bill Huang <bill.huang2001@gmail.com>:
        insertions:    5444   (21%)
        deletions:     207    (19%)
        files:         118    (55%)
        commits:       14     (29%)
        lines changed: 5651   (21%)
        first commit:  Fri Mar 17 20:31:30 2023 +0800
        last commit:   Thu Apr 6 23:55:06 2023 +0800
        
        
       total:
        insertions:    26038  (100%)
        deletions:     1110   (100%)
        files:         216    (100%)
        commits:       48     (100%)
   

  

# 3. Deliverables

- Project structure

  <img src="https://raw.githubusercontent.com/zephyrszwc/zephyrs-image/master/202304101212892.png" alt="2023-04-10_121203" style="zoom:80%;" />
