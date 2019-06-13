// const unformatted = `What did his mother say?;TAGS(mother);
// Dumbest thing a woman could say?;TAGS(female,dumb);
// Finish the sentence: “He lacks self-discipline but likes big butts because...”;TAGS(discipline,ass);
const unformatted = `What did his mother say?;TAGS(mother);
Dumbest thing a woman could say?;TAGS(female,dumb);
Finish the sentence: “He lacks self-discipline but likes big butts because...”;TAGS(discipline,ass);
Finish the sentence: “She wasn’t very pretty but...”;TAGS(female,ugly);
What would you do if your/a pinscher looks you in the eyes and the thing seems horny?;TAGS(horny,dog);
Finish the sentence: “Though his career is on track and he definitely likes pussy...”;TAGS(career,pussy);
You notice that the ugly, fat guy seems to be trying to get you in bed. What do you say?;TAGS(guy,ugly,fat);
You notice that the ugly, fat girl seems to want the D. What do you say?;TAGS(girl,female,ugly,fat);
You are a man, and you know it! You finally get your dream job and cannot afford to lose it! Boss comes. Cool guy. Seems to have a lot of self-control and discipline. Still asks you to nourish his D. How do you strategically approach the situation in the most professional manner, without losing the job?;TAGS(man,job,boss,discipline);
Your boss/teacher/superordinate calls you in office. She is really, really feminine, girly, pretty, fit etc. You are a professional, self-disciplined, hard-working male, and all the things, but you just want to destroy that pussy. Simple. How do you approach the situation as professionally as possible? ;TAGS(boss,female,feminine,pretty,professional,discipline,hard-work,destroy,pussy);
Going out for a walk, you meet the girl of your dreams. She is 120kg, cetacean, has 3.5-4 chins, has Cheetos trails all over her body and likes Titanic. What the fuck do you do?;TAGS(heavy,girl);
You date a girl, a 6 or 7. She likes you. You’re just beginning to like her a little bit and then she pukes that she is a strong and independent woman bullshit. Your dick shrinks, already fucking your insides. How do you explain to her what just happened?;TAGS(heavy,girl);
Finish the sentence: “His dick is small but I … nevertheless”;TAGS(dick);
Your best friend has been acting awkward recently. He’s been sucking a dick without letting you know. Letting out the pressure of being a CEO of a multi-million $ business. All is fine until you realize that this is going to sabotage position. You are a creative person. How do you help the sucker?;TAGS(suck,dick,ceo);
Your friend dates a very feminine, pretty, girly girl. She loves him. She also has a dick but he doesn’t know it yet. How do you solve that puzzle?;TAGS(girl,feminine,dick,friend);
`;

const getTags = tagsText => {
  const init = tagsText.indexOf('(');
  const fin = tagsText.indexOf(')');
  const commaSeparated = tagsText.substring(init + 1, fin);
  const tagsArr = commaSeparated.split(',');
  return tagsArr;
};

const questions = unformatted
  .trim()
  .split(/;TAGS\(\S+\);/g)
  .filter(question => question.length > 3);

const unformattedTags = unformatted
  .trim()
  .match(/;TAGS\(\S+\);/g)
  .filter(question => question.length > 3);

const tags = unformattedTags.map(t => getTags(t));

console.log(tags.length);
console.log(questions.length);
