---
slug: "7-automatically-appending-jira-issue-to-commit-message"
title: "Automatically Appending Jira Issues to Commit Messages"
seo_title: "Automatically Appending Jira Issues to Git Commit Messages"
image: "https://neoish.s3-eu-west-1.amazonaws.com/images/jira-issue.png"
image_width: 1922
image_height: 734
description: "Jira integration with Git means you can automatically pull commits and branches from your repo. But you need to do this first."
date: "2021-04-24 17:02:00"
reading_minutes: 1
tags: git, automation, bash
---

If you use Jira, you probably already know about the Git integration to issues. This basically means your ticket is able to fetch Git commits and branches that are related to the ticket. To be able to do this, your branch, pull request, and/or commit needs to contain the issue code e.g `DEV-1234`.

For branches, this is straightforward. You simply have to create the branch once with the issue name and it will be picked up by Jira automatically. For pull requests, it's the same.

However, for commits, unless you manually add the issue number to all the commits (like an animal), the issue will not reflect these commits. We cannot have that.

## Automatically appending Jira Issue Numbers to Commits

To get our commits to automatically have the issue number, we will be using [Git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks); specifically, the `prepare-commit-msg` hook. You should read about Git hooks if you hadn't before now. But basically, Git hooks allow you to "hook" into the lifecycle of your Git managed application.

For me, I like to do this on the global level but let's do this on a project level first and then talk about how to do it on a global level. The concept is the same.

### Setting up per-project

To get started, `cd` to your project directory and in there, create a new file called `prepare-commit-msg` in your project's `.git/hooks` directory and make it executable:

```shell
$ touch .git/hooks/prepare-commit-msg
$ chmod +x .git/hooks/prepare-commit-msg
```

Next, add the following to the file:

```bash
#!/bin/bash
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

if [[ "${BRANCH_NAME}" =~ [A-Z]{2,}-[[:digit:]]+ ]]; then
  ISSUE_IDENTIFIER="${BASH_REMATCH[0]}"
fi

if [[ -n $ISSUE_IDENTIFIER ]]; then
  sed -i.bak -e "1s/^/$ISSUE_IDENTIFIER /" $1
fi
```

As seen above, the script simply checks for an issue identifier in the branch name using regular expression, and if one is found, it appends this to the commit message.

> You may need to update the RegEx to match your own project. This assumes this format: XX-1234. Two or more upper case letters followed by a dash and numbers. This is usually the default format of Jira.

It's that simple really. Now, any commit you make will have the issue number automatically appended provided it already exists in the branch name.

You can probably make it better by excluding this check from certain branches, but this seems sufficient for me at the moment.

### Setting up for all projects

To set up the hook above to work globally, you will need to update your `.gitconfig` file. You should use the [core.hooksPath](https://git-scm.com/docs/git-config#Documentation/git-config.txt-corehooksPath) setting for this.

I have an example of this in my .dotfiles repo. See [line 15](https://github.com/neoighodaro/dotfiles/blob/master/.gitconfig#L15) for the Git configuration. You only need to create a directory to hold your global hooks and then point your configuration to that directory.

> Note: To do this, you need Git v2.9 or higher. Also, if you use GitKraken, at the moment of writing this article, `v7.5.2`, global hooks are not supported. Use the project level configuration or at least symlink the hook to your global hook.
