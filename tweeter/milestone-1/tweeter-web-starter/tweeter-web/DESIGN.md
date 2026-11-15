1. Classes play the roles of models and presenters, and interfaces play the roles of views. Those three together combine to 
provide the mutability and data structure of React components which then make the MVP interactive for the end user. That avoids 
breaking the dependency rule because all structures can change in one layer without breaking the next layer since upper level
layers don't know or need to know the logic of lower layers. 

2. One reason why MVP is effective is because it modularizes the different functionalities to allow changes to one data flow without 
touching another. Another reason is because it allows for scaling the components and beautifying them without worrying about damaging underlying data 
structures and functionality. 

/Users/djsproul/Desktop/cs340/softwaredesign-1/tweeter/milestone-1/tweeter-web-starter/class-login.png
/Users/djsproul/Desktop/cs340/softwaredesign-1/tweeter/milestone-1/tweeter-web-starter/sequence-login.png

3. FollowService is the combined superclass that implements the logic that was nearly 100% shared between FolloweeService and FollowerService, and PagedItemPresenter gets its generic logic from there. It is a superclass for FolloweePresenter and FollowerPresenter, combining all their shared logic and deferring only the necessary calls to loadMoreFollowers and loadMoreFollowees to the subclass presenters. 

4. Instead of having multiple top-level presenters, I have one logic-heavy presenter (PagedItemPresenter) that implements all the shared logic that its subclasses used to implement. 

/Users/djsproul/Desktop/cs340/softwaredesign-1/tweeter/milestone-1/tweeter-web-starter/PagedItemPresenter-diagram.png
/Users/djsproul/Desktop/cs340/softwaredesign-1/tweeter/milestone-1/tweeter-web-starter/Follower:Followee-diagram.png