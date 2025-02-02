// // import { FFmpegKit } from "ffmpeg-kit-react-native";
// import * as FileSystem from "expo-file-system";

// /**
//  * Post-processes videos recorded with expo-camera: merges multiple videos and overlays text on the result.
//  * @param videoUrls - Array of video file paths from expo-camera to merge.
//  * @param sideQuestText - Text to overlay on the final video.
//  * @returns The file path of the processed video with the text overlay.
//  */
// export default async function postProcessVideo(
//   videoUrls: string[],
//   sideQuestText: string
// ): Promise<string> {
//   const fileListPath = `${FileSystem.cacheDirectory}fileList.txt`;
//   const mergedOutputPath = `${FileSystem.cacheDirectory}merged_video.mp4`;
//   const finalOutputPath = `${FileSystem.cacheDirectory}final_video_with_text.mp4`;

//   try {
//     const fileListContent = videoUrls
//       .map((url) => `file '${url.replace("file://", "")}'`)
//       .join("\n");
//     await FileSystem.writeAsStringAsync(fileListPath, fileListContent);

//     // Merge
//     const mergeCommand = `-f concat -safe 0 -i ${fileListPath} -c copy ${mergedOutputPath}`;
//     const mergeSession = await FFmpegKit.execute(mergeCommand);
//     const mergeReturnCode = await mergeSession.getReturnCode();
//     if (!mergeReturnCode.isValueSuccess()) {
//       throw new Error(
//         `Failed to merge videos. FFmpeg return code: ${mergeReturnCode}`
//       );
//     }

//     console.log("Videos merged successfully:", mergedOutputPath);

//     // Overlay text
//     const overlayCommand = `
//       -i ${mergedOutputPath}
//       -vf "drawtext=text='${sideQuestText}':fontfile=/path/to/font.ttf:fontcolor=black:fontsize=24:box=1:boxcolor=white@0.5:boxborderw=5:x=(w-text_w)/2:y=20"
//       -codec:a copy ${finalOutputPath}
//     `;
//     const overlaySession = await FFmpegKit.execute(overlayCommand);
//     const overlayReturnCode = await overlaySession.getReturnCode();
//     if (!overlayReturnCode.isValueSuccess()) {
//       throw new Error(
//         `Failed to overlay text. FFmpeg return code: ${overlayReturnCode}`
//       );
//     }

//     console.log("Text overlay applied successfully:", finalOutputPath);

//     return finalOutputPath;
//   } catch (error) {
//     console.error("Error in post-processing:", error);
//     throw error;
//   }
// }
