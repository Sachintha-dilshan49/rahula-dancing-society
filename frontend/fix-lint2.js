const fs = require('fs');
const path = require('path');

function replaceInFile(file, replacements) {
    const p = path.resolve('c:/Projects/rahula-dancing-society/frontend', file);
    if (!fs.existsSync(p)) return;
    let content = fs.readFileSync(p, 'utf8');
    for (const [regex, replacement] of replacements) {
        content = content.replace(regex, replacement);
    }
    fs.writeFileSync(p, content, 'utf8');
}

replaceInFile('src/app/(portal)/teacher/achievements/page.tsx', [
  [/\/\/ eslint-disable-line @typescript-eslint\/no-explicit-any {/g, '{ // eslint-disable-line @typescript-eslint/no-explicit-any']
]);

replaceInFile('src/app/(portal)/teacher/gallery/page.tsx', [
  [/\/\/ eslint-disable-line @typescript-eslint\/no-explicit-any {/g, '{ // eslint-disable-line @typescript-eslint/no-explicit-any']
]);

replaceInFile('src/features/marks/components/BulkAddMarksModal.tsx', [
  [/\/\/ eslint-disable-line @typescript-eslint\/no-explicit-any {/g, '{ // eslint-disable-line @typescript-eslint/no-explicit-any']
]);

replaceInFile('src/features/students/components/AddStudentModal.tsx', [
  [/\/\/ eslint-disable-line @typescript-eslint\/no-explicit-any {/g, '{ // eslint-disable-line @typescript-eslint/no-explicit-any']
]);

replaceInFile('src/features/students/components/DeleteConfirmationModal.tsx', [
  [/\/\/ eslint-disable-line @typescript-eslint\/no-explicit-any {/g, '{ // eslint-disable-line @typescript-eslint/no-explicit-any']
]);

replaceInFile('src/features/students/components/EditStudentModal.tsx', [
  [/\/\/ eslint-disable-line @typescript-eslint\/no-explicit-any {/g, '{ // eslint-disable-line @typescript-eslint/no-explicit-any']
]);

replaceInFile('src/shared/components/ChangePasswordModal.tsx', [
  [/\/\/ eslint-disable-line @typescript-eslint\/no-explicit-any {/g, '{ // eslint-disable-line @typescript-eslint/no-explicit-any']
]);

console.log('done');
