# PROJECT\_6

[00:00:00] reusable SFTP architecture. So our biggest client in Germany, they have a lot of, ~~uh, ~~SFTP targets that they have to fetch data on a daily basis. And they are all mostly financial data. So it's a very critical, ~~uh, ~~ operation in terms of security and data loss for us. ~~So. Uh, ~~a system was built to fetch data ~~in the, ~~in the SFTP server using cloud run jobs and, ~~uh, ~~another validation flow ~~with, ~~with data flow before inserting them into BigQuery securely.

So the basic structure here, ~~it ~~is simple. We have. A Python solution that was written ~~by, ~~by me ~~to, ~~to actually connect with the FTP clients, synchronize the data, and then streams through our infrastructure. ~~Uh, ~~the biggest [00:01:00] pain point here was ~~the, ~~the connectivity with their server. So they were in another ~~uh, ~~Google Cloud project.

In another VPC network with, ~~uh, ~~some overlap ips into the VPC. So, ~~uh, uh, ~~a very specific connector was written with Cloud NAT and VPC connector, so we would have always the same outbound IP and things will not overlap over the network. So this solution, ~~uh, ~~it worked ~~really, ~~really well for the first specific case, which was.

A very famous Korean electronic, ~~uh, ~~manufacturer, and then was, ~~um, ~~quickly implemented into the other, ~~uh, ~~process that involved SFTP sync of this types of data. 

