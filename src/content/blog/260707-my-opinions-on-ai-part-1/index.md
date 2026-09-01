---
title: "Brain dumping my thoughts on AI"
pubDate: '2026-07-07'
---

It's been about 4 years since the introduction of ChatGPT, and the time since has been such a whirlwind.
My current state with regards to studying and work using AI has been in some conflict, so here I will attempt to clear up my thoughts.

Even though my knowledge is mostly technical, I will try my best to write about general cases and using general language.
And even though the title says AI, I will be focusing mainly on Large Language Models (LLMs), which is ChatGPT, Claude and similar products.
The ideas are intertwining and hence can be hard to structure, so I apologize in advance if it's hard to follow -- I'm still learning to write.

## My background
I started university in 2022 in computer science, right when the ChatGPT website came out.
Having never learned to code before, the amount of background work I had to do had been overwhelming and unguided.
Suffice to say, I was guilty of using it too much to cope with my impatience -- the LLM could eat coding assignments for breakfast.
Hence, I graduated with little ability to navigate my way around code.

After graduation, I started a job search to little success, and researched if I can learn software engineering on my own (my conclusion was no.)
At the start of this year, I joined a bootcamp on Applied AI, and learned about RAG, Agents, pipelines, eval, and the like.
So I would say I am lightly experienced with training LLMs and making products with it.


## LLMs and inaccuracy
LLMs and their derived products are fundamentally in a different category compared to computer programs.
The probabilistic nature of LLMs as next word predictors mean that given an input, they do not always give the same output.
One could say the same for computer programs and their compilers, but the assumption here is that the computer does not get hit by a cosmic ray bit flip, or a computer program does not depend on any state that's not from the input data.
LLMs, on the other hand, has the indeterministic nature despite those assumptions.

AI products development tries to address this problem through many ways, which I can classify into three types:
- The first type is the hard check (or in-runtime iteration): Combining LLMs with good old computer programs to check the output is properly formatted, and let the LLM try again until it succeeds. If you ever hear about looping, or harnesses, or agents, they are the same thing.
- The second type is the pre-runtime iteration: Basically train the LLM to fit the use case until its tested accuracy is above a certain threshold.
- The third type is feeding it actual live data into the input, through web search or documents (what they call RAG) so that they hallucinate less.

In all cases, the rate of success is never 100%, but we try to make it reach an acceptable threshold.

This leads us to two branches of questioning; one, does this even matter, and two, if it does, does it actually help lessen the load?
I will state out some arguments for AI Agents that I have seen online and at work.

1. Models will keep getting better.
2. Humans also make mistakes.
3. You still need a human in the loop.
4. Businesses don't need it to be correct all the time, just needs to be correct enough to bring value.

I will discuss each of these.

### Does a model get better?
The first thing to consider about this is that a LLM alone fundamentally does not retain knowledge.
It has as much memory as you feed to it (also called "context window").
An ongoing conversation with a chatbot is actually tacking the entire past conversation into the input each time. 
Once you start a new conversation, it does not remember anything.
Current chatbots have improved this by keeping some data with regards to past conversations, so if you use ChatGPT it will "remember" some things about you. (again, it's data saved and tacked onto input.)

Training an existing model to fit a custom workflow (called post-training) is an approach, although I think it's cost-prohibitive for the average user.

### Is it better than a human?
The first answer is no, but I think that's too simple and can be refuted by point 1. ("right now it's not, but in the future it will be.")

In my opinion here, the question is whether the LLM can learn from past mistakes like a human can.
This assumes the knowledge of such mistakes can be verbalized and put down into words, which I think is hard; transferring [tacit knowledge](https://en.wikipedia.org/wiki/Tacit_knowledge) has been an ongoing challenge for the field of education since time immemorial.

An aspect of this question, I think, is about reliability.
For humans, someone being reliable means that you can delegate this work to them and have a confidence that it will be fulfilled.
This confidence is based on past experiences, which means trust has to be, and can be built up.
Even if someone makes errors, if they learn to avoid it over time, it would mean they can be trusted.
A LLM, as it is, does not grow over time like that.
It may happen in the future, if there is a neural network that follows your every keystrokes and actions to study you, but right now, I think LLMs are not reliable.


### The human in the loop, cognitive load, and responsibility.
If the LLM cannot be reliable, then humans still need to be involved to check its output.
This sounds reasonable, but in my opinion is a huge cop-out.

Humans have to pay attention to a number of things at any given time.
Computer programs, being stable in their output, allow for certain *abstractions*, that compress a number of manual steps into a single automated one.
(Of course, in order for this automation to perform well, the work itself has to be standardized.)
For example, think about bookkeeping. Calculations on paper would be done row by row, using a physical calculator. This process was supplanted by Excel, which allows for automated calculation of the whole table at once.
LLMs, on the other hand, cannot afford you this peace of mind.

If the human performs the action manually, then they gain for free a reasoning of how they arrive at the output, and hence upon encountering errors, gain a head start on finding errors.
A computer program saves mental effort by guaranteeing that the output is correct, given the program has been tested (and further patches for edge cases would grow the test based and only increase reliability.)
A LLM on the other hand, can be said to have a degree of error, but it's not clear *where* errors can or usually happen.
This means that the human still has to check everything, without the context that give them the output in the first place.

Another reason this breaks down is simply because we are human. 
Just like the TSA can let slip a gun because they see too many water bottles, a human can see output too many times and be blind to anomalies.
The human attention cannot be high all the time (if it does for an entire workday, I think it's called hypervigilance and would be pretty bad for mental health.)
In order to increase reliability, we build systems to support the oscillating human attention.
There are entire systems designed to support humans in their moments of waning focus (for example, the button design of a nuclear panel is a pretty good study.)

Providers of LLMs have repeatedly say that the output of their products are only for reference, and that the user must be the one doing the verification work.
Offloading the responsibility to the human while giving them none of the cognitive resources to operate with is bad, because it looks like less work when in fact it's not.

It seems like a weird doublethink as well: humans can also make mistakes, but they should be always disciplined when checking outputs.
It's partly a problem with the LLM, and partly with our perception of it -- We see marketing about how it could help us, and we see media about how it has helped other people, and so we grow expectations larger than reality, and those of us who are doing the actual work has to struggle ever harder in the midst of this mismatch.

### Does this matter at all?
So in a context where the work is not safety-critical, for example marketing, LLMs' fails are not disastrous.
This sounds fine in theory, but I do think it's the push by LLM providers that make this thinking dangerous.

A LLM's output is not made with careful consideration, or with the full context of the writer.
In any communication, the writer has the responsibility to capture their full intention to their audience, and this takes work, as any writer would know.
A LLM can only imitate this intention and context, and thus its usage over time gradually erodes the sync between mental models.
Taking its training corpus, the LLM will bring in content that might be related in a general sense, but not useful to any context at hand.

And thus, any collaboration work, in my opinion, will slowly fall apart due to this mental mismatch.

## Part 1 End
After I wrote this, I realized that my points could have been organized better. So I'll get to that sooner or later.
