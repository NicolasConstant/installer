import { Mod, ModTrack, GithubBranchReleaseModel } from "renderer/utils/InstallerConfiguration";
import { GitVersions, NXApi } from "@flybywiresim/api-client";

NXApi.url = new URL('http://localhost:9001');

export type ReleaseInfo = {
    name: string,
    releaseDate: Date,
    changelogUrl?: string,
}

export class AddonData {

    static async latestVersionForTrack(mod: Mod, track: ModTrack): Promise<ReleaseInfo> {
        if (track.releaseModel.type === 'githubRelease') {
            return this.latestVersionForReleasedTrack(mod);
        } else if (track.releaseModel.type === 'githubBranch') {
            return this.latestVersionForRollingTrack(mod, track.releaseModel);
        }
    }

    private static async latestVersionForReleasedTrack(mod: Mod): Promise<ReleaseInfo> {
        return GitVersions.getReleases(mod.creatorName, mod.repoName)
            .then((releases) => ({
                name: releases[0].name,
                releaseDate: releases[0].publishedAt,
                changelogUrl: releases[0].htmlUrl,
            }));
    }

    private static async latestVersionForRollingTrack(mod: Mod, releaseModel: GithubBranchReleaseModel): Promise<ReleaseInfo> {
        return GitVersions.getNewestCommit(mod.creatorName, mod.repoName, releaseModel.branch)
            .then((commit) => ({
                name: commit.sha.substring(0, 7),
                releaseDate: commit.timestamp,
            }));
    }

}
