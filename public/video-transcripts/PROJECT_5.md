# PROJECT\_5

[00:00:00] Okay. Row level security system. Okay, let me paint the picture here. So this big customer in Germany that we have, they have a client of course, and this client is a big company that makes coffee machines in the whole Europe like they are. I think they, perhaps they're the biggest one. I don't know, but yeah, I think they are the biggest one.

So they had this manufacturer system that they log in the coffee brand. They log it in and they see reports. They have many reports on Looker Studio that they are all embedded. With iframe into this application and they were using like Google login for this reports don't be like explicit on the internet.

But at some point it was not working for their, the staff. So they [00:01:00] requested us to make these reports to have a public link. And with a public link, all the data would be exposed to the internet. So the challenge here was, okay, how we hide the data if somebody finds the link. Then this project started, I architected the whole connection of things into the system.

Beginning in the embedding platform that would inject JWT Token and I implemented and I planned the reverse proxy. This reverse proxy was written entirely, it was written in Python and would intercept the initial request from our front end. With the JWT token, it'll extract a lot of data. Check if that user can check the report.

[00:02:00] It'll check what report we are talking about, and then it'll fetch the secrets that we need to actually show the data back in the Looker Studio. Because Looker Studio in this, in, in this scenario would be expecting the, we'll be expecting secrets as. Pars in the URL and then we inject all the way through the queries in big query.

So it's a whole system. So the goal was okay at the end, if there's no token in the URL in the beginning, we shouldn't show data. So this was perfectly implemented. I provided a very high quality documentation for the report team on how they proceed to actually adapt every table or every report that they wanted to have this feature.

And actually this [00:03:00] feature was replicated across other clients from our customer in Germany. So they were able to apply this strategy to many brands, and they were very happy because they did the final customer. It doesn't need to a actually log in with Google inside one platform that they already have logged in.

So it was a strange situation. So now it's seamlessly like they just enter the manufacturer portal and they see the data that they need to see, and if the link of the report leaks, somehow they, someone guesses no data is exposed whatsoever.

