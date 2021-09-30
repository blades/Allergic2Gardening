---
title: Some site design information
description: A little bit about the site, and why it looks the way that it does
date: 2021-09-30
tags:
  - tech
  - websites
  - accessibility
  - usability
  - deuteropathy
  - colour blindness
layout: layouts/post.njk
---

I know the vast majority probably won't care about the technicalities behind the website, but there is method behind the madness and some of it is even as a result of the very things that made this site seem necessary to me in the first place.

I've spent the vast majority of my life in front of computers, one way or another. One of the first jobs I did professionally was working on accessible websites and it was the first time where my deuteropathy - my colour blindness - was actually something _useful_ in this context. It turns out that there are standards for accessibility that websites should follow that give useful guidelines and advice on how to structure your website in order to make it easy to use for people with all sorts of disabilities. Not everyone can use a mouse, or hear audio cues, or (as in my case) visually discern screen elements easily.

This gave me some very strong ideas about how to put websites together, and when coupled with some equally strong ideas about usability in general it left me with a set of tools to help build websites that more people could use easily.  It turns out that the guidelines are actually reasonably easy to follow for the most part, and if you structure your website in a certain way and avoid certain bad practices then your website is available to more people.  Even better, it taught me to use _progressive enhancement_ in order to make things better - in other words, start with the basics that work for as many people as possible, and then use enhancement techniques to make it better on top of that.

One example of that is on this very site, where the search link in the top bar will take you to a search page. On that page is a search box that uses a simple HTML form to send the search request to google. However, if you have javascript turned on, that form is hidden and a new one appears with a javascript search facility that's hosted locally on this site instead and finds results as you type in the box.

Another one of the other elements that is important in accessibility is having decent visual contrast between the background and the text on that background.  The guidelines even go so far as to state ways to calculate that contrast ratio and give values that they consider to be acceptable.  Part of this also caters to those who, like me, require some adjustment to colours in order to be able to visually discern on-screen elements.  In the case of this site, having a dark background and a light text gives a very high contrast ratio, and because it's basically black-and-white there's no issue with colour blindness, either.  I actually based this on an open source style project called [Bahunya](https://kimeiga.github.io/bahunya/) with some mild tweaks to my own personal tastes.  They went with white text on a dark background because [this study](https://www.nature.com/articles/s41598-018-28904-x) suggests that it's better for blood flow in the layer behind the retina, so I've left it that way even though it's not necessarily what I would normally go for.

The basic setup of the site is taken from [eleventy-high-performance-blog](https://github.com/google/eleventy-high-performance-blog) which scores **really** highly on accessibility out of the box, meaning that I didn't have to worry about it myself other than making sure that I add some descriptive text here and there.  It's using [11ty](https://www.11ty.dev/) to generate the code because I'm a big fan of serving up static content and it means it can be heavily optimised and very lightweight, and it also means that once I've made the tweaks I want to make to the basic structure that all I have to do is to generate the output and point the URL to the server and I don't have to worry about things breaking.

The downside is that, yes, it's relatively plain.  However, as a blog it is very fast, very lightweight, very clean, and nothing gets in between the text and the reader.  In terms of usability, it's as good as it gets - the posts are literally on the home page, right up front, and accessibility is not an issue.  My only question at this point in time is whether to have a link to the posts in the menu or if simply having them on the home page directly is enough.  At least for now as things are just starting, it's fine as-is.  As I write more posts, I might have to think about alternative presentation options, or heavily customising the template. But I can figure that out later - for now, the main objective of getting this off the ground has been achieved, and the rest can be figured out down the line.