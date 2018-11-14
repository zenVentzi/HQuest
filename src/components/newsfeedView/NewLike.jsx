/* 

Problem: how do we create like news? For example, a user can give 2 likes now
then after 10 minutes 2 more etc.

Exaplain the process from user liking an answer to coming to the newsfeed of another user:
Upon even 1 like, the followers get news that this user has liked an answer.
The followers don't get any more news if the user "likes the answer some more later". Only the initial
likes get into the newsfeed of the user's followers. Somewhat of a solution could be to update
the news number of likes if the user likes the answer more later. Do we show the numOfLikes in newsfeed?
It's simpler not to. What is the cost, timewise, of implementing the numofLikes for newsfeed?

Strive for multiple likes. If too time consuming, go for single like news 


User liked x20 User1's answer  */
