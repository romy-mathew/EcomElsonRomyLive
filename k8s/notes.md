Why ingress matters? 
Without ingress load balancer per service would be expensive 
With ingress one load balancer many services

With readiness probe:
Pods join load balancer
ONLY after becoming ready

Qos class: BestEffort
which means: "This tells kube that use whatever resources you want."

What is resources in Deployment?
In resources there are two types requests and limits.
Why request exists:
Suppose pod says:
requests:
  cpu: 500m
  memory: 512Mi
Then Scheduler interprets it as pod is saying atleast I need the above resources if the node have the resources scheduler will place the pod there.
If no requests Scheduler thinks this pod needs nothing and may place all the pods in one node that will led to 100% cpu node crashes.
Why limit exists:
Suppose pod says:
limits:
  memory: 512Mi
Then kubernets will only allow 512Mi thats it, beyond that just that pod dies.

Without PVC -> Pod dies Data dies
With PVC -> Pod dies Data persists 


NOTE for Dockerfile:
As per my knowledge anyways we are mapping dokcer engine to our container from our host but incase of cli we cant map so in order to run docker commands we need dockker cli installed in our container

