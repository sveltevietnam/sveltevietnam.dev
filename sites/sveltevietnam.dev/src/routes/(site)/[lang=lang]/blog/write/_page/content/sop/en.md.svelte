<h2 id="writing-process">Overview of the writing process</h2>

### Step 1: Install Necessary Software

1. [node.js](https://nodejs.org):
    - The required node.js version for the project is defined in
      [package.json](https://github.com/sveltevietnam/sveltevietnam.dev/blob/v1/package.json) under the "engines" key.
    - It is recommended you use [volta](https://volta.sh/) to manage `node.js` versioning. If installed, volta will automatically set the appropriate version for the project based on the definition in `package.json`.
2. [lefthook](https://lefthook.dev/installation): a [git hook](https://git-scm.com/docs/githooks) manager that automatically runs code convention & sanity checks before committing code.
3. [pnpm](https://pnpm.io/installation): a package manager that serves as an alternative to `npm`.

You of course also need [git](https://git-scm.com/) and a code editor of your choice. Setting up
code editor is unfortunately out of the scope of this document, but there should be plenty
resources on the web for that.

### Step 2: Set up Local Development Environment

1. Clone the source code:

    <enhanced-code-block group display="tabs">

    ```bash title="HTTPS"
    git clone https://github.com/sveltevietnam/sveltevietnam.dev.git
    ```

    ```bash title="SSH"
    git clone git@github.com:sveltevietnam/sveltevietnam.dev.git
    ```

    ```bash title="GitHub CLI"
    gh repo clone sveltevietnam/sveltevietnam.dev
    ```

    </enhanced-code-block>

2. Run the following setup command at the root directory of the project:

    ```bash
    pnpm boot
    ```

3. Start the development server at the `sites/sveltevietnam.dev` directory:

    ```bash title="development"
    cd sites/sveltevietnam.dev
    pnpm dev
    ```

If everything is set up correctly, you can now access a local copy of the Svelte Vietnam Blog
at http://localhost:5005/en/blog.

### Step 3: Initialize Post Data

In your terminal, get to the `sites/sveltevietnm.dev` directory. If this is your first time
contributing content for sveltevietnam.dev, initialize your *author data* with the following command:

```bash
pnpm create:person
```

Next, initialize *blog post data* with the following command:

```bash
pnpm create:post
```

### Step 4: Complete your Post Content

Following step 3, you will need to finish you writing at two newly created files:

- `.../content/en.md.svelte`: your writing in English,
- `.../content/vi.md.svelte`: your writing in Vietnamese.

You may refer to ["Post Content Syntax: Markdown + Svelte"](#syntax) for examples and guidelines
on special syntax and features available in post content, as well as ["Updating Post
Metadata"](#updating-post-metadata) on how to edit post metadata.

<div class="c-callout c-callout--info c-callout--icon-question">

If you can only contribute in one of the two languages, just leave the other empty.
Administrators and community members may be able to help you with translation.

</div>

### Step 5: Create a Pull Request

Once you are satisfied with your writing, you will need to perform typical source control operations
with `git` and Github, including committing your changes onto a new branch and [creating a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) targeting the default branch (the branch displayed when you visit the [sveltevietnam/sveltevietnam.dev repository](https://github.com/sveltevietnam/sveltevietnam.dev)).

You may also use [Github CLI](https://cli.github.com/) to simplify certain workflows. For example, after
[installation](https://github.com/cli/cli#installation) and login (`gh auth`),
you can create a pull request quite conveniently with the following command:

```bash
gh pr create
```

<div class="c-callout c-callout--info">

Refer to [DEVELOPMENT.md - Commit Message Guidelines](https://github.com/sveltevietnam/sveltevietnam.dev/blob/v1/docs/DEVELOPMENT.md#commit-message-guidelines) for guidelines on writing commit messages. Workflow with `git`
and Github are not particularly difficult, but require several steps and can be achieved in
different ways, so we will not go into details here. If you need assistance or have questions,
please contact our administrators via the [Discord - Discussion - Blog](https://discord.sveltevietnam.dev) channel.

</div>

### Step 6: Review and Publish

After your pull request is sent, administrators will review your writing and involve any necessary
discussion / further enquiry right in the pull request thread on Github.

Once review is completed, administrators will merge your pull request, shortly after which your post
will go live on the Svelte Vietnam Blog 🎉.
