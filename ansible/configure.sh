#!/bin/sh

function usage {
    echo "Usage: $0 -t TAG"
}

function parse_args {
    while [ -n "$1" ]; do
        case "$1" in
            -h|--help) help ;;
            -t)
                shift
                if [ -z "$1" ]; then
                    echo $0: Missing tag. >&2
                    usage
                    exit 2
                fi
                TAG=$1
                ;;
        esac
        shift
    done
}

parse_args "$@"

CMD="ansible-playbook config.yml --vault-id vault-pass"

if [ -n "$TAG" ]; then
    CMD="$CMD -t='$TAG'"
fi

$CMD