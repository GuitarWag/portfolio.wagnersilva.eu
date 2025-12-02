# PROJECT\_1

[00:00:00] So we have this big solar panel manufacturer as a client, and they work alongside with installers. These installers are third party companies that sometimes can be just a one person operation to a big company with many employees.

This manufacturer wanted to use this network as a marketing platform.

So they needed a marketing tool that would enable these installers to create web pages on the fly with their localized data and also marketing components from the manufacturer. So what was the solution? We built a platform that was able to deploy new websites in seconds. These installers, they could just SSO coming from another system from this manufacturer, and they just landed [00:01:00] into this editor where they can choose components.

From the solar manufacturer brand with their custom marketing and all the information, and also they could localize putting their own content, their own text, their own images of their own solar installations. They could also choose many languages to support in the final app. This was a win-win solution for the solar brand. Because every time the final customers open the website created by the installer , all that marketing content was delivered to the user.

From the technical aspect, we built two web applications with React. One for the editor and the other one just to render the final pages in a more optimized way. There was a rest, API in the middle, written in Node.js with TypeScript that's [00:02:00] running on cloud run. This API connects to a cloud SQL instance that stores all the information that we save within this application. There's also a data stream that sends data to BigQuery that can be used by the report team to get insightful information about the usage of the application.

