# CommitLint Config

A [CommitLint configuration](https://commitlint.js.org/reference/configuration.html#shareable-configuration) for writing well-formatted and consistent Git commits.

## Installation

```bash
npm install --save-dev @theholocron/commitlint-config
```

## Usage

In your project `package.json` add the following:

```json
{
	"commitlint": {
		"extends": "@theholocron"
	}
}
```

## How We Write Commits

### Problems

The following rules are considered problems for `@theholocron/commitlint-config` and will yield a non-zero exit code when not met.

Consult [docs/rules](https://conventional-changelog.github.io/commitlint/#/reference-rules) for a list of available rules.

#### type-enum

-   **condition**: `type` is found in value
-   **rule**: `always`
-   **value**: "build" | "ci" | "chore" | "docs" | "feat" | "fix" | "perf" | "refactor" | "revert" | "style" | "test"

```sh
echo "foo: some message" # fails
echo "fix: some message" # passes
```

#### type-case

-   **description**: `type` is in case `value`
-   **rule**: `always`
-   **value**: "lowercase"

```sh
echo "FIX: some message" # fails
echo "fix: some message" # passes
```

#### type-empty

-   **condition**: `type` is empty
-   **rule**: `never`

```sh
echo ": some message" # fails
echo "fix: some message" # passes
```

#### scope-case

-   **condition**: `scope` is in case `value`
-   **rule**: `always`
-   **value**: "lowercase"

```sh
echo "fix(SCOPE): some message" # fails
echo "fix(scope): some message" # passes
```

#### subject-case

-   **condition**: `subject` is in one of the cases "sentence-case", "start-case", "pascal-case", "upper-case"`
-   **rule**: `never`

```sh
echo "fix(SCOPE): Some message" # fails
echo "fix(SCOPE): Some Message" # fails
echo "fix(SCOPE): SomeMessage" # fails
echo "fix(SCOPE): SOMEMESSAGE" # fails
echo "fix(scope): some message" # passes
echo "fix(scope): some Message" # passes
```

#### subject-empty

-   **condition**: `subject` is empty
-   **rule**: `never`

```sh
echo "fix:" # fails
echo "fix: some message" # passes
```

#### subject-full-stop

-   **condition**: `subject` ends with `value`
-   **rule**: `never`
-   **value**: "."

```sh
echo "fix: some message." # fails
echo "fix: some message" # passes
```

#### header-max-length

-   **condition**: `header` has `value` or less characters
-   **rule**: `always`
-   **value**: 72

```sh
echo "fix: some message that is way too long and breaks the line max-length by several characters" # fails
echo "fix: some message" # passes
```
