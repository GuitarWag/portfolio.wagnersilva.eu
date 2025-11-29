# PROJECT\_9

[00:00:00] API six API gateway. So in this project the big issue and the big pain point was that Google cloud Armor, which is actually really good is very expensive if you want to go enterprise or even premium. So we have currently the basic protection, the free tier. It has a few features regarding WAF, DDoS, and

In some aspects that you can customize some specific rules to be protected by mass attacks and everything. But it wasn't enough. And with the rise of AI agents being able to somehow. Scan your system, try to perform some credentials, extraction and everything from your service.

We started to get a concerned about that. And the solution that I proposed and implemented was to have another API gateway that would sit behind [00:01:00] the global load balancing that we use from Google. The global load balancing receives the requests. It has some kind of protection. And then before going to our service, before going to the backend service, the network endpoint groups, it goes through this API gateway.

The API gateway in this situation uses Apache API six and CrowdSec for threat intelligence. CrowdSec is really great. It has a lot of data about known attackers and patterns that can like, inform you in real time into the dashboard if you are already receiving an attack or anything.

So it's really great. It's community driven we are really happy with that. So by far we transferred some services to use this API gateway, and we are able to actually do one by one, so we don't have to just switch on or off the entire system to use this overnight. And then we [00:02:00] can monitor and observe if the final user has some issues.

If we have some false positives into this whole workflow that would block real users to use the system. So it was a very elegant solution. The system is extremely fast and runs over a managed instance group without the auto scale if necessary, but I don't remember needing more than one machine to actually handle this.

It can handle a 100 K requests by second. It's a really fast system. Yeah, I guess that's it. It's a very good architecture and saves a very good amount of money for almost the same results as the premium or enterprise from Google Cloud Armor.

