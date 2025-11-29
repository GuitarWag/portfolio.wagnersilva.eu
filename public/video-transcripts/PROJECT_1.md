# PROJECT\_1

[00:00:00] The page builder platform. Okay. This was , a request from a solar panel company that operates worldwide, operates a lot in the United States, a lot in the EMEA region, and a lot in APAC. So they had this need of offering to their installers. The installers are third part companies that sometimes they can be very small, just one person operation.

Some installer companies are a little bit bigger, but the installers buy solar panels from this big solar company. So they wanted to give to these installers a marketing tool, a powerful marketing tool so they can have a website, because a lot of them didn't have a website. Can you imagine? So they wanted these installers to have, a powerful, modern looking, very nice, responsible [00:01:00] everything.

And then we built the platform. Yeah, we managed to talk with some of the installers and talked with some high hierarchy people in the solar. Company and then we built the whole ecosystem. The ecosystem itself, it's not so complex. I built two web applications. One is the editor that they can actually sso into this web application from another app that we also implemented.

They can SSO into, they can choose. Whatever components they want to have on the page. Some components are specific to the installers, so they can, for instance, they can have their own text so they can add photos of the installations that they have done. So on one side, on part is that, and some of the [00:02:00] components are marketing.

From the solar panel company. So it was a very win-win for them because when the final customers entered the installer company website that they have created, they would see the information about that specific installer. But they would be seeing a lot of content from the solar panel company about their products, about how they operate.

It was really the strategy. Over that. So the system itself, okay, it has these two web applications. There is one rest, API built in node in the middle that perform all the CRUD operations that we need in this system. It connects to a cloud sql. There is in this diagram, and we have some data streams that send the data to.

Big query for, just for reports on Looker Studio and the reports. We can tell how many pages we have created [00:03:00] the last month , which country has. Our pages created over time. So we have basically, the whole data into the BigQuery and then the report team can build whatever they want with this information.

And of course, without sensitive information of course, but the statistics and everything are streamed to this BigQuery.

