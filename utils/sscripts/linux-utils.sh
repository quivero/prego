#!/bin/bash

# This files requires source activation by below bash command run:
# >> source ./linux-utils.sh

set -e

# strip "v" prefix if present
VERSION="${VERSION#v}"

# Checks command existence
#
# examples:
#   >> command_exists echo # 0 (success)
command_exists() {
  command -v "$@" > /dev/null 2>&1
}

# Checks command existence
#   returns 0 (success)
#
# examples:
#   >> command_exists echo # 0 (success)
listPIDsAttachedToPort () {
  echo "$(lsof -i ":$1" | awk "{ print $2 }" | awk "NR>1")"  | uniq -u
}

# Compares two CalVer (YY.MM) version strings.
#   if version A is newer or equal than version B, or 1 (fail) otherwise. Patch
# releases and pre-release (-alpha/-beta) are not taken into account
#
# examples:
#   >> calver_compare 20.10 19.03 # 0 (success)
#   >> calver_compare 20.10 20.10 # 0 (success)
#   >> calver_compare 19.03 20.10 # 1 (fail)
calver_compare() (
  set +x

  yy_a="$(echo "$1" | cut -d"." -f1)"
  yy_b="$(echo "$2" | cut -d"." -f1)"
  if [ "$yy_a" -lt "$yy_b" ]; then
    return 1
  fi
  if [ "$yy_a" -gt "$yy_b" ]; then
    return 0
  fi
  mm_a="$(echo "$1" | cut -d"." -f2)"
  mm_b="$(echo "$2" | cut -d"." -f2)"
  if [ "${mm_a#0}" -lt "${mm_b#0}" ]; then
    return 1
  fi

  return 0
)

# Checks if the version specified in $VERSION is at least
# the given CalVer (YY.MM) version.
# returns 0 (success) if $VERSION is either unset (=latest)
# or newer or equal than the specified version. Returns 1 (fail)
# otherwise.
#
# examples:
#
# >> VERSION=20.10
# >> version_gte 20.10 # 0 (success)
# >> version_gte 19.03 # 0 (success)
# >> version_gte 21.10 # 1 (fail)
version_gte() {
  if [ -z "$VERSION" ]; then
      return 0
  fi
  eval calver_compare "$VERSION" "$1"
}

# Gets Linux distribution
#
# examples:
#   >> get_distribution
#   ubuntu
get_distribution() {
  lsb_dist=""

  # Every system that we officially support has /etc/os-release
  if [ -r /etc/os-release ]; then
    lsb_dist="$(. /etc/os-release && echo "$ID")"
  fi
  # Returning an empty string here should be alright since the
  # case statements don"t act unless you provide an actual value

  # perform some very rudimentary platform detection
  lsb_dist="$(echo "$lsb_dist" | tr "[:upper:]" "[:lower:]")"

  echo "$lsb_dist"
}

# Gets Debian version
#
# examples:
#   >> get_debian_version
#   bullseye
get_debian_version() {
  dist_version="$(sed "s/\/.*//" /etc/debian_version | sed "s/\..*//")"
  case "$dist_version" in
    11)
      echo "bullseye"
    ;;
    10)
      echo "buster"
    ;;
    9)
      echo "stretch"
    ;;
    8)
      echo "jessie"
    ;;
  esac
}

# Check if this is a forked Linux distro
#
# examples:
#   >> check_forked # 1 (fail)
check_forked_dist() {

  # Check for lsb_release command existence, it usually exists in forked distros
  if command_exists lsb_release; then
    # Check if the `-u` option is supported
    set +e
    lsb_release -a -u > /dev/null 2>&1
    lsb_release_exit_code=$?
    set -e

    # Check if the command has exited successfully, it means we"re in a forked distro
    if [ "$lsb_release_exit_code" = "0" ]; then
      # Print info about current distro
      cat <<-EOF
      You're using '$lsb_dist' version '$dist_version'.
      EOF

      # Get the upstream release info
      lsb_dist=$(lsb_release -a -u 2>&1 | tr '[:upper:]' '[:lower:]' | grep -E 'id' | cut -d ':' -f 2 | tr -d '[:space:]')
      dist_version=$(lsb_release -a -u 2>&1 | tr '[:upper:]' '[:lower:]' | grep -E 'codename' | cut -d ':' -f 2 | tr -d '[:space:]')

      # Print info about upstream distro
      cat <<-EOF
      Upstream release is '$lsb_dist' version '$dist_version'.
      EOF
    else
      if [ -r /etc/debian_version ] && [ "$lsb_dist" != "ubuntu" ] && [ "$lsb_dist" != "raspbian" ]; then
        if [ $lsb_dist = "osmc" ]; then
          # OSMC runs Raspbian
          lsb_dist="raspbian"
        else
          # We"re Debian and don"t even know it!
          lsb_dist="debian"
        fi

        dist_version="$( get_debian_version )"
      fi
    fi
  fi
}

# Check if this is a forked Linux distro
#
# examples:
#   >> dist_deprecation_notice() {s
 # 1 (fail)
dist_deprecation_notice() {

  distro="$1"
  distro_version="$2"

  echo
  printf "\033[91;1mDEPRECATION WARNING\033[0m\n"
  printf "    This Linux distribution (\033[1m%s %s\033[0m) reached end-of-life and is no longer supported by this script.\n" "$distro" "$distro_version"
  echo   "    No updates or security fixes will be released for this distribution, and users are recommended"
  echo   "    to upgrade to a currently maintained version of $distro."
  echo
  printf   "Press \033[1mCtrl+C\033[0m now to abort this script, or wait for the installation to continue."
  echo
  sleep 10
}

# Check if this is a forked Linux distro
#
# examples:
#   >> get_dist_version # 1 (fail)
get_dist_version() {

  lsb_dist=$( get_distribution )
  case "$lsb_dist" in
    ubuntu)
      if command_exists lsb_release; then
        dist_version="$(lsb_release --codename | cut -f2)"
      fi
      if [ -z "$dist_version" ] && [ -r /etc/lsb-release ]; then
        dist_version="$(. /etc/lsb-release && echo "$DISTRIB_CODENAME")"
      fi
    ;;

    debian|raspbian)
      dist_version="$( get_debian_version )"
    ;;

    centos|rhel|sles)
      if [ -z "$dist_version" ] && [ -r /etc/os-release ]; then
        dist_version="$(. /etc/os-release && echo "$VERSION_ID")"
      fi
    ;;

    *)
      if command_exists lsb_release; then
        dist_version="$(lsb_release --release | cut -f2)"
      fi
      if [ -z "$dist_version" ] && [ -r /etc/os-release ]; then
        dist_version="$(. /etc/os-release && echo "$VERSION_ID")"
      fi
    ;;
  esac

  echo $dist_version
}

# Check if it is a macOS
#
# examples:
#   >> is_darwin # 1 (fail)
is_darwin() {
  case "$(uname -s)" in
  *darwin* ) true ;;
  *Darwin* ) true ;;
  * ) false;;
  esac
}

# Check if it is Windows OS
#
# examples:
#   >> is_wsl # 1 (fail)
is_wsl() {

  case "$(uname -r)" in
    *microsoft* ) true ;; # WSL 2
    *Microsoft* ) true ;; # WSL 1
    * ) false;;
  esac
}

# Check linux distribution deprecation
#
# examples:
#   >> check_dist_deprecation
check_dist_deprecation() {
  lsb_dist=$( get_distribution )
  dist_version=$( get_dist_version )

  # Print deprecation warnings for distro versions that recently reached EOL,
  # but may still be commonly used (especially LTS versions).
  case "$lsb_dist.$dist_version" in
    debian.stretch|debian.jessie|raspbian.stretch|raspbian.jessie|ubuntu.xenial|ubuntu.trusty|fedora.*)
      dist_deprecation_notice "$lsb_dist" "$dist_version"
      ;;
  esac
}

# Get package manager on Linux distributions
#
# examples:
#   >> get_pkg_manager
get_pkg_manager() {
  # Verifies if command runs as sudo
  lsb_dist=$( get_distribution )
  dist_version=$( get_dist_version )

  case "$lsb_dist" in
    ubuntu|debian|raspbian)
      pkg_manager="apt-get"

      echo "$pkg_manager"
      exit 0
      ;;

    centos|fedora|rhel)
      if [ "$(uname -m)" != "s390x" ] && [ "$lsb_dist" = "rhel" ]; then
        echo "Packages for RHEL are currently only available for s390x."
        exit 1
      fi
      if [ "$lsb_dist" = "fedora" ]; then
        pkg_manager="dnf"
      else
        pkg_manager="yum"
      fi

      echo "$pkg_manager"
      exit 0
      ;;

    sles)
      if [ "$(uname -m)" != "s390x" ]; then
        echo "Packages for SLES are currently only available for s390x"
        exit 1
      fi

      pkg_manager="zypper"

      echo "$pkg_manager"
      exit 0
      ;;

    *)
      if [ -z "$lsb_dist" ]; then
        if is_darwin; then
          echo
          echo "ERROR: Unsupported operating system \"macOS\""
          echo "Please get Docker Desktop from https://www.docker.com/products/docker-desktop"
          echo
          exit 1
        fi
      fi
      echo
      echo "ERROR: Unsupported distribution \"$lsb_dist\""
      echo
      exit 1
      ;;

  esac
}

# Get OS information in pattern "lsb_dist:dist_version:pkg_manager"
#
# examples:
#   >> get_pkg_manager
os_info() {
  lsb_dist="$( get_distribution )"
  dist_version="$( get_dist_version )"
  pkg_manager="$( get_pkg_manager )"

  if is_wsl; then
    echo
    echo "Operating system WSL DETECTED."
    echo
    cat >&2 <<-'EOF'

    EOF
    ( set -x; sleep 20 )
  fi

  if [ -z "$lsb_dist" ]; then
    if is_darwin; then
      echo
      echo "Operating system "macOS" DETECTED."
      echo
      exit 1
    fi
  fi

  check_forked_dist
  check_dist_deprecation

  echo "$lsb_dist:$dist_version:$pkg_manager"
}

# Get root command
#
# examples:
#   >> echo "$( get_if_root )"
#  sudo -E sh -c
get_if_root() {
  user="$(id -un 2>/dev/null || true)"
  sh_c="sh -c"

  if [ "$user" != "root" ]; then
    if command_exists sudo; then
      sh_c='sudo -E sh -c'
    elif command_exists su; then
      sh_c='su -c'
    else
      cat >&2 <<-'EOF'
      Error: We require either "sudo" or "su" commands for root mode.
      EOF
      exit 1
    fi
  fi

  echo "$sh_c"
}

# Get filtered list of files
#
# examples:
#   >> get_pkg_manager
filtered_ls () {
  ls "$1" | grep "$2"
}

export -f command_exists
export -f listPIDsAttachedToPort
export -f calver_compare
export -f version_gte
export -f get_distribution
export -f get_debian_version
export -f check_forked_dist
export -f dist_deprecation_notice
export -f get_dist_version
export -f is_darwin
export -f is_wsl
export -f check_dist_deprecation
export -f get_pkg_manager
export -f os_info
export -f get_if_root
export -f filtered_ls
