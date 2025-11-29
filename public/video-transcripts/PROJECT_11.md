# PROJECT\_11

**Wagner:** [00:00:00] on demand database anonymization. So this was a very big pain for developers and testers when I entered the company a few years ago. So I always observed this process and the process was automatic in a way that the database has have some scripts between live database staging and development.

And the script itself, there was no AI back then decided by itself. When is the time to perform a snapshot from the live database? Just erase everything on staging and development and then replace with new data and everything. So this was very painful because sometimes.

People were just working on data, on staging before committing to the live database, especially non-technical workers that were working through the IMA admin interfaces on new data and checking, testing, everything. [00:01:00] So sometimes work was lost. At some point. So it was not that great and the process was very painful.

And a big problem was that they anonymized data with asterisks all over. So like you would have on a database, a lot of data with first name, last name, IBAN, email, whatever the data, sometimes you had a lot of asterisks on it. And the pain point for that is that sometimes the testers were testing like a edit feature on a specific UI interface, and they would submit their, the forms, and the forms wouldn't go forward.

And the forms didn't show any error on the screen because. A hidden field in that JSON object had unsupported [00:02:00] symbols for a specific field that was mapped in the object validation in the front end or in the backend. Maybe and because of those characteristics that were inserted at some point during the anonymization of the database, things wouldn't work in the test staging environment.

This was painful. Like sometimes people would lose one hour, like just trying to figure out what to do, how to test properly a full workflow, a more complex feature into the end-to-end test or the final front end test. Observing all this I proposed a new solution for this process of anonymization, which was taking advantage of the file that we have for backups in Google storage.

So

the process now is just almost, okay, let, we have a button to press that says, okay, we need a new database [00:03:00] for staging and dev because. We need some new data. We need things that are, structures that are on live data, that it's on the live database, that we need it and it needed now to test.

So a process was built on top of that with the far to provision, the actual virtual machine that, that will act as a database, which we chose not to have, cloud SQL on staging because of costs. So we have a vm, we have all the setup to install my SQL in the same version in that VM and setup as it is to be in parallel, to be equal to the live database that we have.

And then we load the credentials first actually into this sql to all the credentials that we have on the staging environment remain the same. So developers will not [00:04:00] lose access once we switch the database. So we load the credentials, and then we load the data from the live environment.

So up to this point this VM is very isolated in terms of connectivity. So there are firewall rules that. Do not allow external connection to this VM because now it's a little bit critical because it has data that's from the live environment and it has credentials that it, that are from the staging environment.

So this VM is very isolated for a few minutes. And then we just run the process of anonymization, which is a more efficient masking process now, and does not put asterisks or symbols that wouldn't work on a specific field. So every type of field is mapped to be a valid field into our validation [00:05:00] system, and we create general information.

To every place where information is sensitive, like emails, first name, last name, IBAN things that can't be leaked and are not public addresses everything. So yeah, so we prepare this new VM with the new database, and then we have a post process on that actually. Validates if all the data that was correctly generalized or, and anonymized in some cases.

After that, on, once the validation is done, there is a automatic process and there is a actual human being that can enter into the system and check a few points into the database. Then we apply firewall rules, so this VM can be accessible by the developers and the testing. And after that, [00:06:00] we stopped the old VM for a while.

We take that same IP that the VM was using attached to the new vm. People don't have to change, like where they are pointing to the staging database. And then we just reboot everything. So systems start fresh and connect to the new database. The old VM is stopped now and can be started again.

If someone needs to work on that data to extract any information or. To recover some work they were doing so we can always do some backup recovery and transfer that to the new database that we are having now on stage environment. 

