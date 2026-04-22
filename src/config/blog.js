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
  },
  {
  slug: "edgeways-dissertation",
  title: "Building EdgeWays: What I Learned",
  image: `${process.env.PUBLIC_URL}/images/blogs/edgeways.jpeg`,
  date: "22-04-2026",
  links: {},
  description: `
  For my final year dissertation, I built EdgeWays — an attempt to help monitor conversational dominance using voice recognition and machine learning.
  
  I already had experience with React, but I had never used React Native to build a mobile app before. Along the way, I learned about MFCC features for audio processing, as well as VAD (voice activity detection) to reduce constant computation and make the system more efficient.
  
  Learning how to use TensorFlow Lite for mobile model inference was both interesting and challenging. I trained my model using the LibriSpeech dataset, which contains a large collection of audiobook recordings. 
  
  Training and building the model was by far the most difficult part. With real-time audio recognition, there’s a trade-off: shorter audio windows give quicker responses and feel more “live”, but result in lower accuracy, while longer windows improve accuracy but make the system feel slower. Finding a balance between the two was a key challenge.
  
  I tested the app on lots of people (mainly my poor, unwilling flatmates) and found that it struggled more with my male flatmates, as we sounded more similar, compared to female flatmates where voices were more distinct (not a huge surprise).
  
  The app is intended for use in workplace meeting settings to help encourage more balanced participation. That said, I’m not sure I’d personally enjoy being monitored like that in meetings — it might add a bit too much pressure.
  
  Overall, this was definitely one of the most challenging but rewarding things I’ve worked on (hopefully it pays off with a good grade).
  `.trim()
}
];

export default blogData;
