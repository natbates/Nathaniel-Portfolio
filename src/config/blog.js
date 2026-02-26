const blogData = [
  {
    slug: "first-post",
    title: "A Simple Starter Guide to Next.js",
    image: `${process.env.PUBLIC_URL}/images/blogs/nextjs.jpeg`,
    date: "26-02-2025",
    links: { docs: "https://nextjs.org/docs" },
    description: `
    So I have only recently started using Next.js and I have to give credit where it's due.
    It is a very handy framework. However, its incredibly confusing - especially if you havent had lots of experience in react. I just wanted to yap about somethings
    which i wish i had known when i started using/some tools i used whilst learning. 

    Firstly, its important to know your tech stack before you start, using the npx commands to create a next app is very easy but you should be aware of what its adding to the project. 
    
    Secondly, if you are on version next js 13, you should be aware of the new app directory and the changes to routing. Making apis is super easy with next js as you just make a folder the name of the api and add a route.ts file with a get/post/put/delete function in it.
    
    Thirdly, you should be aware of the new file based routing system and the new client/server components. This is a bit more advanced but it can be very useful for performance and worth looking into.
    
    Fourthly, you should know how the next.config.js file works and how to use it to add environment variables and how its used for caching.
    
    Finally, you NEED to know how to use NextAuth as it is the best authentication system for next js and is very easy to set up. It also has a lot of providers and is very flexible. I used it for my urf radio website and it worked perfectly.

    `.trim()
  }
];

export default blogData;