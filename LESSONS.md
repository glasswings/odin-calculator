Shuntyard Calculator: Lessons Learned
=====================================

I am ready to take on bigger programming projects.  This has been
a hobby for most of my life, and one of the things about a hobby
is that you don't necessarily have to finish anything.  When I
work on, say, an Advent of Code problem, there's an answer for me
to get to, but the code doesn't have to look good or be
maintainable later.  I haven't used git very much before Odin or
had to think about building a revision history that I would want
to read later.

So those are the skills I have been most interested in developing
during this course.  Since making a computer do things on a small
scale is already something I can do, I want to expand my frame of
reference a bit and imagine doing that kind of work in a larger
project.  I'm proud of how this one turned out.

I let the features creep a bit, and had to rein them in a little.
I learned more about git -- a lot more about git.  And probably
the most unexpected thing is how I hit the limits of my
JavaScript knowledge.  I think that's the most interesting, so
I'll reflect on it first.

Things I Wish I Knew in JS
--------------------------

I don't know how to do multi-file projects or how to document an
API.  That's more frustrating that I thought it would be.

In Rust, I'd just rely on Rustdoc and have a browser window open
full of type and function signatures.  I didn't realize how much
I would miss that, even in a small project, until I didn't have
it.  I felt like I was keeping everything in my head and I didn't
even have type checking to help me out.

I also feel quite shaky with how to best use the object system.
I don't think this is my general difficulty with OO (this project
isn't complex enough for me to feel lost in a forest of nouns),
it's just more specifically the fact that `this` behaves in
JS-specific ways that I haven't memorized by heart.

Refactoring the Shuntyard Layer
-------------------------------

I initially wrote the shuntyard layer to hold its state in a
global variable, then I implemented more of the register and UI
code so that I would have something to test it against.  At that
point I decided to refactor the shuntyard layer and get its state
out of the global, into an object.

My plan was to write shuntyard-v2 depending on the register
branch, which in turn depended on shuntyard-v1, then rebase
to a development history with shuntyard-v2 -> register.  On the
whole this worked.

I'm not convinced that git made the work easier, and I can
certainly understand why an organization wouldn't try to use
rebase as a tool for refactoring.  Retracing previous development
history as a guide to refactoring is a solid concept, but using
automatied git subcommands, eh, maybe not.

I did get a lot of practice with merge tools, and settled on
diffuse as my favorite.

One of the problms I ran into is that git by itself can only call
attention to textual conflicts, changes that collide with each
other.  I would have loved to have static type checking, and I'm
excited to learn TypeScript for that reason.

Abandoned Features
------------------

I initially wanted to use the addition button for something in a
context where the addition operator didn't make sense.  And I
wanted to have a good way to carry the result of an operation
into a future one. If you type `2 + 2 =` you should have options
like

- multiply the result by 5 to get 20
- add 2 again and again to get 6, 8, 10
- feed the result into square root and get 2

I only implemented the first one.  Many actual 5-function
calculators have the same limitation, so I didn't feel too bad
about this, but I feel that in a small way I had to exercise a
"yes, but it's time to ship" decision.

Accomplishments
---------------

It works!  It looks good!  (I don't intend to market myself as a
graphic designer or front-end specialist, but it looks as good as
anything I could create in office software, so I'll take it as a
win.)  And the thing I'm most proud of: I haven't touched
operator precedence in years, but I was able to remember how to
do it from first-principles, problem-solving skills, and vague
familiarity with a past solution.

In short: I could have talked through it as an interview problem,
and that felt really good.

I'm happy with my performance in an unfamiliar language and my
ability to learn new tools as I need them.

<<<I've done some experimentation with TypeScript, and it certainly
feels better to have early failure helping me out.  At one point,
when I was refactoring the stack layer to keep its state in an
object, I was using `git rebase` to walk through the rest of the
code I had created.  A lot of rebase steps merged cleanly but
didn't work: the code depended on function names that didn't
exist anymore.

If I had a type-checker it would have >>>
