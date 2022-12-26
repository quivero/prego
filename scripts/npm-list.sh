#!/bin/bash

deps_keys=( "dependencies" "devDependencies" )
grep_ignores=( 
        "*node_modules*" 
        "*.git*" 
        "*package-lock.json*"
        "*codecov*"
        "*scripts*"
    )

dependency_ocurrences=""
dependency_count=0

FENCE_SIZE=50
is_used=1
IS_COLORED=0
IS_VERBOSE=0

usage()
{
  echo "Usage: npm-list [ -v | --verbose ] [ -c | --color ] project_root_route"
  echo "1. Navigate to package.json folder;"
  echo "2. Run either command:"
  echo "    bash scripts/npm-list ."
  echo "    bash scripts/npm-list -c ."
  echo "    bash scripts/npm-list -v ."
  echo "    bash scripts/npm-list -c -v ."
  exit 2
}

function repeat() {
    perl -E "say \"$1\" x $2"

}

# Get value from json dictionary
# 
# examples:
# 	>> jsonValue "{"a": 1, "b": 2}" "a"
#   1
function jsonValue() {
    echo "$1" | jq -r ".$2"
}

# Get keys from json dictionary
# 
# examples:
# 	>> jsonKeys "{"a": 1, "b": 2}"
#   a
#   b
function jsonKeys() {
    echo "$1" | jq -r 'to_entries[] | .key'
}

function command_build () {
    grep_command_1="grep -rnw $PROJECT_ROOT_PATH -e \"$dependency_name\""
        
    string_pattern="'%s\n'"
    expansion='"${grep_ignores[@]}"'
    
    grep_command_2="grep -vEf <(printf $string_pattern $expansion)"

    grep_command="$grep_command_1 | $grep_command_2"
    echo "$grep_command"
}

command_name='npm-list'
tags='vch'

# Evaluates available commands
PARSED_ARGUMENTS=$(getopt -a -n $command_name -o $tags --long verbose -- "$@")
VALID_ARGUMENTS=$?

if [ "$VALID_ARGUMENTS" != "0" ]; then
  usage
fi

eval set -- "$PARSED_ARGUMENTS"
while :
do
case "$1" in
    # Script tags
    -c | --color) IS_COLORED=1; shift   ;;
    -v | --verbose) IS_VERBOSE=1; shift   ;;
    
    # Usage option
    -h | --help) 
        usage
    ;;   
    
    # -- means the end of the arguments; drop this, and break out of the while loop
    --) shift; break ;;
    # If invalid options were passed, then getopt should have reported an error,
    # which we checked as VALID_ARGUMENTS when getopt was called...
    *) 
        echo "Unexpected option: $1 - this should not happen."
        usage ;;
esac
done

PROJECT_ROOT_PATH="$1"

unused_file="$PROJECT_ROOT_PATH/.npm_clean"

rm -f "$unused_file"
touch "$unused_file"

packages_route="$PROJECT_ROOT_PATH/package.json"
packages_json="$(cat $packages_route)"
package_keys="$(jsonKeys "$packages_json")"

for deps_key in "${deps_keys[@]}"; do
    deps_json="$(jsonValue "$packages_json" "$deps_key")"

    for dependency_name in $(jsonKeys "$deps_json"); do
        grep_command="$(command_build)"
        
        dependency_count="$(eval "$grep_command" | wc -l)"
        dependency_filenames="$(eval "$grep_command")"

        # Checks if there is at least once dependency appearance
        if [[ $dependency_count -eq 1 ]]; then
            is_used=0
            echo "$dependency_name" >> $unused_file
        else
            is_used=1
        fi

        if [[ $IS_COLORED -eq 1 ]]; then
            # Color red
            if [ $dependency_count -eq 0 ] || [ $dependency_count -eq 1 ]; then
                dependency_name="\033[91;1m$dependency_name\033[0m"
            
            # Color green
            else
                dependency_name="\033[0;32m$dependency_name\033[0m"
            fi
        fi

        if [[ $IS_VERBOSE -eq 1 ]]; then
            echo "$(repeat '=' $FENCE_SIZE)"
            printf "$dependency_name:$dependency_count \n"
            echo "$(repeat '-' $FENCE_SIZE)"
            echo "Filenames: $dependency_filenames"
            echo "$(repeat '-' $FENCE_SIZE)"
        else
            # dependency_name:occurrence_count:  
            printf "$dependency_name:$dependency_count:$is_used\n"
        fi
    done;
done;
