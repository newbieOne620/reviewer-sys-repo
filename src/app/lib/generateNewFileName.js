/**
 * Generates a new filename based on a prefix and the original filename.
 *
 * @param {string} originalFileName - The original filename.
 * @returns {string} - The new filename.
 */
export function generateNewFileName(originalFileName) {
  const nameWithoutExtension = originalFileName.replace(/\.[^/.]+$/, "");
  const fileExtension = originalFileName.slice(
    originalFileName.lastIndexOf(".")
  ); // Extract the file extension

  return `${nameWithoutExtension}-${Date.now()}${fileExtension}`; // Create new filename with prefix and timestamp
}
