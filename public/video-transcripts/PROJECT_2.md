# PROJECT\_2

[00:00:00] The Enterprise Rag and AI agents, okay. We have a big customer from Germany and they are very worried about AI models ingesting their data and everything. So they asked me first to build a chat interface that connected to Gemini models directly using the Vertex SDK because they were very worried about the employees using separate personal accounts with AI to just throwing out PDFs and CSVs and not being.

Compliant to a specific protocol of handling data in the company. So the first, okay, the first step was build a chat interface that connected to Gemini and they would just use it, this chat interface, plain model single sign-on with the Google IAP in the middle to, so they, so the system is [00:01:00] protected and they don't have to log in again with another credential type.

This was done and then this one grows. They had agents and sub agents that they could edit the system prompt to make a sub agent to know things better, like not connected to any database yet, but they could upload things, upload PDFs and put some raw text and give system props to the agent so it'll be a little bit more specialized and still be using the plain model of Gemini, not needing to fine tune on every anything.

So this solution itself saved a lot of money because they didn't have to pay. Individual license for pro models anymore. So the cost was all centralized on this and is all pay as you go. All API calls to Vertex. SDK, I'm sorry, I'm being very specific, but that's it. [00:02:00] All API calls to the Vertex, SDK, they were all labeled by application environment and user.

At the end of the month, I can show them a dashboard on the billing account and they can see which user, which user uses the system the most, and the costs on that. The costs are very low now because they're using mostly the optimized model. Not everybody actually uses the pro.

But, uh, yeah it's been great. So, and about the RAG, after a while using the chat system, they were very happy with the possibility of having base agents, sub agents, projects and everything. So they asked about, a business intelligence layer that would know anything, everything about all the things that happen in the company and the campaigns that they do and everything that they sell.

So I implemented the [00:03:00] rag system for them and connected to the chat. So it was really nice developing this because, I had never worked with Neo4J before. And in graph databases in general. So it was a really new experience for me and it was really great. So I connected Neo4J Qdrant, and what was the other one?

Yeah, that was a Postgres database in the middle as well to just store some metadata. And we did our architecture that, we have an ingestion system that we use Docling in Python to ingest documents and embed them into these, all these databases.

And we have a dynamic mechanism of text so we can take content as security level. So we have. Public, private admin whatever security level that we want to target in each document. And this TAG also help the [00:04:00] Neo4J database to create the graph of the knowledge about certain aspect of the document, which is really cool.

And now we have a system that's connected to this. Agent sub agents in the other chat application. They can set up a sub agent to know a specific content about a specific campaign, I would say using the TAGS. And whenever they talk with the agent will dynamically query the rag system in a scoped way.

So it'll not rAG all over the other documents that are not relevant to that specific chat. So it increases a lot, the quality of the responses and the general architecture itself. Okay. Sorry, this one was long, but it was a complex subject.

