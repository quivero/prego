#!/bin/bash
# Docker CE for Linux installation script
#
# See https://docs.docker.com/engine/install/ for the installation steps.
#
# This script is meant for quick & easy install via:
#   $ curl -fsSL https://get.docker.com -o get-docker.sh
#   $ sh get-docker.sh
set -e

BASEDIR=$(dirname "$0")
source "${BASEDIR}/linux-utils.sh"

# strip "v" prefix if present
VERSION="${VERSION#v}"

# The channel to install from:
#   * nightly
#   * test
#   * stable
DEFAULT_CHANNEL_VALUE="test"
if [ -z "$CHANNEL" ]; then
  CHANNEL="$DEFAULT_CHANNEL_VALUE"
fi

DEFAULT_DOWNLOAD_URL="https://download.docker.com"
if [ -z "$DOWNLOAD_URL" ]; then
  DOWNLOAD_URL="$DEFAULT_DOWNLOAD_URL"
fi

DEFAULT_REPO_FILE="docker-ce.repo"
if [ -z "$REPO_FILE" ]; then
  REPO_FILE="$DEFAULT_REPO_FILE"
fi

mirror=""
DRY_RUN=${DRY_RUN:-}
while [ $# -gt 0 ]; do
  case "$1" in
    --dry-run)
      DRY_RUN=1
      ;;
    --*)
      echo "Illegal option $1"
      ;;
  esac
  shift $(( $# > 0 ? 1 : 0 ))
done

is_dry_run() {
  if [ -z "$DRY_RUN" ]; then
    return 1
  else
    return 0
  fi
}

echo_docker_as_nonroot() {
  if is_dry_run; then
    return
  fi
  if command_exists docker && [ -e /var/run/docker.sock ]; then
    (
      set -x
      $sh_c "docker version"
    ) || true
  fi

  # intentionally mixed spaces and tabs here -- tabs are stripped by "<<-EOF", spaces are kept in the output
  echo
  echo "================================================================================"
  echo
  if version_gte "20.10"; then
    echo "To run Docker as a non-privileged user, consider setting up the"
    echo "Docker daemon in rootless mode for your user:"
    echo
    echo "    dockerd-rootless-setuptool.sh install"
    echo
    echo "Visit https://docs.docker.com/go/rootless/ to learn about rootless mode."
    echo
  fi
  echo
  echo "To run the Docker daemon as a fully privileged service, but granting non-root"
  echo "users access, refer to https://docs.docker.com/go/daemon-access/"
  echo
  echo "WARNING: Access to the remote API on a privileged Docker daemon is equivalent"
  echo "         to root access on the host. Refer to the "Docker daemon attack surface""
  echo "         documentation for details: https://docs.docker.com/go/attack-surface/"
  echo
  echo "================================================================================"
  echo
}

docker_installation_pre_warning () {
  if command_exists docker; then
    cat >&2 <<-'EOF'
      Warning: the "docker" command appears to already exist on this system.

      If you already have Docker installed, this script can cause trouble, which is
      why we're displaying this warning and provide the opportunity to cancel the
      installation.

      If you installed the current Docker package using this script and are using it
      again to update Docker, you can safely ignore this message.

      You may press Ctrl+C now to abort this script.
    EOF
    ( set -x; sleep 20 )
  fi
}

do_docker_install() {
  # Verifies if command runs as sudo
  sh_c=$( get_if_root )

  if is_dry_run; then
    sh_c="echo"
  fi

  lsb_dist=$( get_distribution )
  dist_version=$( get_dist_version )

  case "$lsb_dist" in
    ubuntu|debian|raspbian)

      pre_reqs="apt-transport-https ca-certificates curl"
      if ! command -v gpg > /dev/null; then
        pre_reqs="$pre_reqs gnupg"
      fi

      dist_URL="$DOWNLOAD_URL/linux/$lsb_dist"
      signed_route="/etc/apt/keyrings/docker.gpg"
      architecture="$(dpkg --print-architecture)"
      apt_repo="deb [arch=$architecture signed-by=$signed_route] $dist_URL $dist_version $CHANNEL"

      echo "================================================================================"
      (
        if ! is_dry_run; then
          set -x
        fi

        $sh_c "apt-get update -qq >/dev/null"
        $sh_c "DEBIAN_FRONTEND=noninteractive apt-get install -y -qq $pre_reqs >/dev/null"
        $sh_c "mkdir -p /etc/apt/keyrings && chmod -R 0755 /etc/apt/keyrings"
        $sh_c "curl -fsSL \"$DOWNLOAD_URL/linux/$lsb_dist/gpg\" | gpg --dearmor --yes -o /etc/apt/keyrings/docker.gpg"
        $sh_c "chmod a+r /etc/apt/keyrings/docker.gpg"
        $sh_c "echo \"$apt_repo\" > /etc/apt/sources.list.d/docker.list"
        $sh_c "apt-get update -qq >/dev/null"
      )

      pkg_version=""
      if [ -n "$VERSION" ]; then
        if is_dry_run; then
          echo "# WARNING: VERSION pinning is not supported in DRY_RUN"
        else
          # Will work for incomplete versions IE (17.12), but may not actually grab the "latest" if in the test channel
          pkg_pattern="$(echo "$VERSION" | sed "s/-ce-/~ce~.*/g" | sed "s/-/.*/g").*-0~$lsb_dist"
          search_command="apt-cache madison "docker-ce" | grep "$pkg_pattern" | head -1 | awk "{\$1=\$1};1" | cut -d" " -f 3"
          pkg_version="$($sh_c "$search_command")"

          echo "INFO: Searching repository for VERSION "$VERSION""
          echo "INFO: $search_command"

          if [ -z "$pkg_version" ]; then
            echo
            echo "ERROR: "$VERSION" not found amongst apt-cache madison results"
            echo
            exit 1
          fi

          if version_gte "18.09"; then
              search_command="apt-cache madison "docker-ce-cli" | \
                      grep "$pkg_pattern" | \
                      head -1 | \
                      awk "{\$1=\$1};1" | \
                      cut -d" " -f 3"
              echo "INFO: $search_command"
              cli_pkg_version="=$($sh_c "$search_command")"
          fi

          pkg_version="=$pkg_version"
        fi
      fi
      (
        pkgs="docker-ce${pkg_version%=}"
        if version_gte "18.09"; then
            # older versions didn"t ship the cli and containerd as separate packages
            pkgs="$pkgs docker-ce-cli${cli_pkg_version%=} containerd.io"
        fi
        if version_gte "20.10"; then
            pkgs="$pkgs docker-compose-plugin"
        fi
        if version_gte "20.10" && [ "$(uname -m)" = "x86_64" ]; then
            # also install the latest version of the "docker scan" cli-plugin (only supported on x86 currently)
            pkgs="$pkgs docker-scan-plugin"
        fi
        # TODO(thaJeztah) remove the $CHANNEL check once 22.06 and docker-buildx-plugin is published to the "stable" channel
        if [ "$CHANNEL" = "test" ] && version_gte "22.06"; then
            pkgs="$pkgs docker-buildx-plugin"
        fi
        if ! is_dry_run; then
          set -x
        fi
        $sh_c "DEBIAN_FRONTEND=noninteractive apt-get install -y -qq --no-install-recommends $pkgs >/dev/null"
        if version_gte "20.10"; then
          # Install docker-ce-rootless-extras without "--no-install-recommends", so as to install slirp4netns when available
          $sh_c "DEBIAN_FRONTEND=noninteractive apt-get install -y -qq docker-ce-rootless-extras${pkg_version%=} >/dev/null"
        fi
      )
      echo "================================================================================"

      echo_docker_as_nonroot

      exit 0
      ;;

    centos|fedora|rhel)
      if [ "$(uname -m)" != "s390x" ] && [ "$lsb_dist" = "rhel" ]; then
        echo "Packages for RHEL are currently only available for s390x."
        exit 1
      fi
      if [ "$lsb_dist" = "fedora" ]; then
        pkg_manager="dnf"
        config_manager="dnf config-manager"
        enable_channel_flag="--set-enabled"
        disable_channel_flag="--set-disabled"
        pre_reqs="dnf-plugins-core"
        pkg_suffix="fc$dist_version"
      else
        pkg_manager="yum"
        config_manager="yum-config-manager"
        enable_channel_flag="--enable"
        disable_channel_flag="--disable"
        pre_reqs="yum-utils"
        pkg_suffix="el"
      fi
      repo_file_url="$DOWNLOAD_URL/linux/$lsb_dist/$REPO_FILE"

      pkg_version=""
      if [ -n "$VERSION" ]; then
        if is_dry_run; then
          echo "# WARNING: VERSION pinning is not supported in DRY_RUN"
        else
          pkg_pattern="$(echo "$VERSION" | sed "s/-ce-/\\\\.ce.*/g" | sed "s/-/.*/g").*$pkg_suffix"
          search_command="$pkg_manager list --showduplicates "docker-ce" | grep "$pkg_pattern" | tail -1 | awk "{print \$2}""
          pkg_version="$($sh_c "$search_command")"

          echo "INFO: Searching repository for VERSION "$VERSION""
          echo "INFO: $search_command"

          if [ -z "$pkg_version" ]; then
            echo
            echo "ERROR: "$VERSION" not found amongst $pkg_manager list results"
            echo
            exit 1
          fi

          if version_gte "18.09"; then
            # older versions don"t support a cli package
            search_command="$pkg_manager list --showduplicates "docker-ce-cli" | grep "$pkg_pattern" | tail -1 | awk "{print \$2}""
            cli_pkg_version="$($sh_c "$search_command" | cut -d":" -f 2)"
          fi

          # Cut out the epoch and prefix with a "-"
          pkg_version="-$(echo "$pkg_version" | cut -d":" -f 2)"
        fi
      fi
      (
        pkgs="docker-ce$pkg_version"
        if version_gte "18.09"; then
          # older versions didn"t ship the cli and containerd as separate packages
          if [ -n "$cli_pkg_version" ]; then
            pkgs="$pkgs docker-ce-cli-$cli_pkg_version containerd.io"
          else
            pkgs="$pkgs docker-ce-cli containerd.io"
          fi
        fi

        if version_gte "20.10" && [ "$(uname -m)" = "x86_64" ]; then
            # also install the latest version of the "docker scan" cli-plugin (only supported on x86 currently)
            pkgs="$pkgs docker-scan-plugin"
        fi

        if version_gte "20.10"; then
          pkgs="$pkgs docker-compose-plugin docker-ce-rootless-extras$pkg_version"
        fi
        # TODO(thaJeztah) remove the $CHANNEL check once 22.06 and docker-buildx-plugin is published to the "stable" channel
        if [ "$CHANNEL" = "test" ] && version_gte "22.06"; then
            pkgs="$pkgs docker-buildx-plugin"
        fi

        if ! is_dry_run; then
          set -x
        fi
        $sh_c "$pkg_manager install -y -q $pkgs"
      )

      echo_docker_as_nonroot
      exit 0
      ;;

    sles)
      if [ "$(uname -m)" != "s390x" ]; then
        echo "Packages for SLES are currently only available for s390x"
        exit 1
      fi
      if [ "$dist_version" = "15.3" ]; then
        sles_version="SLE_15_SP3"
      else
        sles_minor_version="${dist_version##*.}"
        sles_version="15.$sles_minor_version"
      fi
      opensuse_repo="https://download.opensuse.org/repositories/security:SELinux/$sles_version/security:SELinux.repo"
      repo_file_url="$DOWNLOAD_URL/linux/$lsb_dist/$REPO_FILE"
      pre_reqs="ca-certificates curl libseccomp2 awk"
      (
        if ! is_dry_run; then
          set -x
        fi
        $sh_c "zypper install -y $pre_reqs"
        $sh_c "zypper addrepo $repo_file_url"
        if ! is_dry_run; then
            cat >&2 <<-"EOF"
            WARNING!!
            openSUSE repository (https://download.opensuse.org/repositories/security:SELinux) will be enabled now.
            Do you wish to continue?
            You may press Ctrl+C now to abort this script.
            EOF
            ( set -x; sleep 30 )
        fi
        $sh_c "zypper addrepo $opensuse_repo"
        $sh_c "zypper --gpg-auto-import-keys refresh"
        $sh_c "zypper lr -d"
      )
      pkg_version=""
      if [ -n "$VERSION" ]; then
        if is_dry_run; then
          echo "# WARNING: VERSION pinning is not supported in DRY_RUN"
        else
          pkg_pattern="$(echo "$VERSION" | sed "s/-ce-/\\\\.ce.*/g" | sed "s/-/.*/g")"
          search_command="zypper search -s --match-exact "docker-ce" | grep "$pkg_pattern" | tail -1 | awk "{print \$6}""
          pkg_version="$($sh_c "$search_command")"
          echo "INFO: Searching repository for VERSION "$VERSION""
          echo "INFO: $search_command"
          if [ -z "$pkg_version" ]; then
            echo
            echo "ERROR: "$VERSION" not found amongst zypper list results"
            echo
            exit 1
          fi
          search_command="zypper search -s --match-exact "docker-ce-cli" | grep "$pkg_pattern" | tail -1 | awk "{print \$6}""
          # It"s okay for cli_pkg_version to be blank, since older versions don"t support a cli package
          cli_pkg_version="$($sh_c "$search_command")"
          pkg_version="-$pkg_version"

          search_command="zypper search -s --match-exact "docker-ce-rootless-extras" | grep "$pkg_pattern" | tail -1 | awk "{print \$6}""
          rootless_pkg_version="$($sh_c "$search_command")"
          rootless_pkg_version="-$rootless_pkg_version"
        fi
      fi
      (
        pkgs="docker-ce$pkg_version"
        if version_gte "18.09"; then
          if [ -n "$cli_pkg_version" ]; then
            # older versions didn"t ship the cli and containerd as separate packages
            pkgs="$pkgs docker-ce-cli-$cli_pkg_version containerd.io"
          else
            pkgs="$pkgs docker-ce-cli containerd.io"
          fi
        fi
        if version_gte "20.10"; then
          pkgs="$pkgs docker-compose-plugin docker-ce-rootless-extras$pkg_version"
        fi
        # TODO(thaJeztah) remove the $CHANNEL check once 22.06 and docker-buildx-plugin is published to the "stable" channel
        if [ "$CHANNEL" = "test" ] && version_gte "22.06"; then
            pkgs="$pkgs docker-buildx-plugin"
        fi
        if ! is_dry_run; then
          set -x
        fi
        $sh_c "zypper -q install -y $pkgs"
      )
      echo_docker_as_nonroot
      exit 0
      ;;

    *)
      if [ -z "$lsb_dist" ]; then
        if is_darwin; then
          echo
          echo "ERROR: Unsupported operating system "macOS""
          echo "Please get Docker Desktop from https://www.docker.com/products/docker-desktop"
          echo
          exit 1
        fi
      fi
      echo
      echo "ERROR: Unsupported distribution "$lsb_dist""
      echo
      exit 1
      ;;

  esac
}

do_install() {
  # Verify if docker already exists and outputs a warning log
  docker_installation_pre_warning

  # Check if this is a forked distro
  check_forked_dist

  # Check if this is a deprecated distro
  check_dist_deprecation

  do_docker_install
}

do_install

systemctl start docker.service
systemctl enable docker.service
