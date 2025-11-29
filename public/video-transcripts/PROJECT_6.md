# PROJECT\_6

[00:00:00] Reusable SFTP architecture. So our biggest client in Germany, they have a lot of SFTP targets that they have to fetch data on a daily basis. And they are all mostly financial data. So it's a very critical operation in terms of security and data loss for us. A system was built to fetch data in the SFTP server using Cloud Run jobs and another validation flow with Dataflow before inserting them into BigQuery securely.

So the basic structure here is simple. We have a Python solution that was written by me to actually connect with the SFTP clients, synchronize the data, and then streams through our infrastructure. The biggest [00:01:00] pain point here was the connectivity with their server. So they were in another Google Cloud project.

In another VPC network with some overlapping IPs into the VPC. So a very specific connector was written with Cloud NAT and VPC connector, so we would have always the same outbound IP and things will not overlap over the network. So this solution worked really well for the first specific case, which was a very famous Korean electronics manufacturer, and then was quickly implemented into the other processes that involved SFTP sync of these types of data. 

