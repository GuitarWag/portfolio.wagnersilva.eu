# PROJECT\_3

**Wagner:** [00:00:00] the three directional real time sync project. Okay, so the same global solar company that I also built the webpage builder. They had these sources of data that, one of them was Pardot sales was Pardot. The other one was talent. LMS, which is a LMS system. For their process of certification of these installers as they need training to actually install the solar panels in the houses.

So they want to, they wanted to track some information about this system. And then another internal database that relates to another tool that we've built for them. So these two actually. It is about the process of registering the projects that they have done in the houses, or even sometimes it's commercial as well.

So [00:01:00] we had three databases that they have shared information and they need to be in sync and sometimes. One of these databases, they would have new data that need to be replicated into the other two. So I've built a jobs mechanism that runs over cloud run jobs. I think it has 12 or 13 actions that, that they execute synchronously and they.

They perform the updates. Every update is saved into Firestore with before and after state snapshots. So the people from the solar panel company can enter into admin system and check actually. What information changed and they can contact the support if they wanted that to be reversed or corrected or anything.

It doesn't happen much, but it's a possibility. So we [00:02:00] audit every aspect of this process. And one limitation here is that none of these systems had real time events, like when data updated. Just call an API. So I had to implement a system based on cloud scheduler. So every 15 minutes something runs in the system and detects which other workflow needs to run based on the data that we collected.

And so on. So there is one running mechanism in the middle that acts as this real time event that these other systems they don't have. So this was the main challenge on this, but it works really fine. The costs are really low because the image are very optimized and they run really fast for each workflow.

