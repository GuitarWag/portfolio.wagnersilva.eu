# PROJECT\_8-1

[00:00:00] CI/CD pipeline migration. So our biggest client in Germany, they had this huge list of Jenkins deployment configurations and a single VM on their old data center. And my function here was go through build by build and transfer all of them to Google Cloud build. So this was in the middle of a process of a huge migration.

So some of the applications that I have to rewrite the build process were also being developed to run on a cloud environment. So it was not every time, it was not just a task that I just needed to create the sh file and just run it as it is. The whole process of build of each individual application was analyzed and then was converted to be able to run on cloud run back then. Because when we did [00:01:00] this, there was no AI to help to debug big files like this and. Just build some bootstrap files to work on it. So it was a whole manual process. Things that use it. A old MongoDB database that we have back then they have to be rewritten to connect to Firestore. That was the solution that we came up with it and yes, so builds have changed a little bit and I had to transfer all of them, to this new environment. And of course I had to do for the production environment, for the staging environment, and for the development environment that we have.

So not all went through all three environments, but yes, staging and production, they were heavy. 

