# Mapping the Vietnamese Diaspora[^1]

This repository contains the codebase for the _Mapping the
Vietnamese Diaspora_ project. It is actively maintained (as of
Fall 2022) by Nathan Kim; please contact him at
nathan.kim[at]yale.edu with any questions.

## Principles

The goal of this project isn't just to map the Vietnamese
diaspora, but to do so in respectful, non-homogenizing ways.

There are some principles we can follow to fulfill this goal:

1. We aren't just making a cool map or piece of technology, but a
   tool describing real people and their ways of life. We center
   these people in our work, and not any technological or
   academic concept.
2. We strive to understand the potential impacts, and especially
   harms, embedded in this kind of work. We understand the
   necesity of diligent, honest, correct, and uplifting research
   in this pursuit.

## Technical details

This repository is split mostly into two segments: the `ui`
folder, which has some metadata spilling over to the root level,
and the `data` folder, which contains an `renv`-based R
project.[^2]

To get started with the website development, run the following in
a shell:

```
git clone https://git.nathan-kim.org/18kimn/vietnam-diaspora
cd vietnam-diaspora
pnpm install --frozen-lockfile
pnpm dev
```

This will install all necessary Typescript dependencies, and
begin a local dev server at `http://localhost:5173` where you can
preview the site.

If you'd like to focus on the data specifically, follow the first
two lines of the above chunk, then open the `data/data.Rproj`
file in RStudio or a similar R-project-respecting IDE. `renv`
maintains an `.Rprofile` script that will be sourced when you
open `data/data.Rproj`, and this will install any necessary
dependencies and ensure your machine is up to date.

[^1]: A working title.
[^2]:
    `renv` is an environment manager for R; it installs and
    tracks your project's used libraries and packages and pins
    them to specific versions so that only those specific
    versions will be used on a collaborator's machine. Through
    this process it allows reproducible data analysis. "R
    projects" refer to the `.Rproj`-file-based convention created
    by RStudio, wherein the working directory is _always_ set to
    the project root and any `.Renviron` or `.Rprofile` files at
    the root of the project level will always be sourced when the
    project opens. By standardizing the file paths it enforces
    one level of reproducibility and stability.
