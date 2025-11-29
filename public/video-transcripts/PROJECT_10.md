# PROJECT\_10

**Wagner:** [00:00:00] Real-time CDC pipeline. so this is a type of a very common request from this big customer that we have in Germany. They often want to move data from deepest places in the infrastructure. Another infrastructure. Places onsite, places on premise, places from third party services that they have.

So in this case, they have a few servers running OTRS instances for their ticket system. So all systems run. Now ZNUNY, which is a new version of the, of OTRS and it's fully open source and driven by the community. So the goal here was basically take the databases from ZNUNY Connect to Google Datastream, which is a service on Google Cloud [00:01:00] that acts as a replication manager.

In between the MySQL database and BigQuery, it can handle sorts of different data sources and data targets, in this case was MySQL to BigQuery. And the interesting fact about Datastream and this specific this specific workflow is that. The report team can have access to the data stream that I created, and they can choose what table.

And within these tables they can choose which columns they want to replicate. So it's very good. So they can control, they're like the admin person that has access to this. They can control using the user interface, which is very easy. They can control. Sensitive data to be out of BigQuery for reporting and just select [00:02:00] specific table specific columns to be transmitted to BigQuery, and they can update that anytime they want.

