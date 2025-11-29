# PROJECT\_7

[00:00:00] smart API Integration. So this one was a little bit challenging. And the big pain point on this was actually the PASCOM API itself and how it worked. So they have a not very good documentation. So first thing was going through that and understand how that service works. On stat was done.

The implementation itself was a little bit tricky because they didn't have filter in the API and they didn't have pagination in the API. So you only had an option to choose for how long you wanted to fetch data in the past. So you can say, okay, I wanna fetch 24 hours in the past. And the limit of the API was always a thousand.

So you could said, okay, I wanna have 48 hours, and the reply would be a thousand. [00:01:00] But then you can have more results in that API. So I implemented that calculation in pagination itself, in our side. It would calculate if actually the timestamp of the last result. Of that API would be actually 48 hours.

Or do we need to query a little bit more further with an offset of the first visit that we have. So we have always like the exact time that we want to fetch the last 48 hours and then. After that, we have a bunch of data to, to process in the Python application. And of course, once we have all the data, we have to decide, okay, what are the actual new rows to transmit to big query in this situation?

Deduplication layer was also built into the Python system to ensure that [00:02:00] the bigQuery has only unique data after the API fetch. So this was the stream and also a separate table on BigQuery was created for the metadata of each load. So it saves some specific metadata.

Not all data, not with before and after that would be over and would maybe cost a little bit of money. However system was implemented. Now the report team can actually just query data from BigQuery and get information about the their PBX and call center information on PASCOM.

