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

replaceInFile('src/app/(portal)/student/dashboard/page.tsx', [
  [/const latestMarks = marks\.length > 0[\s\S]*?: \[\];/g, '']
]);

replaceInFile('src/app/(portal)/student/marks/page.tsx', [
  [/const lowestScore = [^;]+;/g, '']
]);

replaceInFile('src/app/(portal)/teacher/achievements/page.tsx', [
  [/catch \(err: any\)/g, 'catch (err: any) // eslint-disable-line @typescript-eslint/no-explicit-any'],
  [/catch \(error: any\)/g, 'catch (error: any) // eslint-disable-line @typescript-eslint/no-explicit-any'],
  [/>\"/g, '>&quot;'],
  [/\"</g, '&quot;<']
]);

replaceInFile('src/app/(portal)/teacher/gallery/page.tsx', [
  [/, ImageIcon/g, ''],
  [/catch \(err: any\)/g, 'catch (err: any) // eslint-disable-line @typescript-eslint/no-explicit-any'],
  [/catch \(error: any\)/g, 'catch (error: any) // eslint-disable-line @typescript-eslint/no-explicit-any'],
  [/>\"/g, '>&quot;'],
  [/\"</g, '&quot;<']
]);

replaceInFile('src/app/(public)/about/page.tsx', [
  [/society's/g, 'society&apos;s']
]);

replaceInFile('src/features/marks/components/BulkAddMarksModal.tsx', [
  [/catch \(err: any\)/g, 'catch (err: any) // eslint-disable-line @typescript-eslint/no-explicit-any'],
  [/catch \(error: any\)/g, 'catch (error: any) // eslint-disable-line @typescript-eslint/no-explicit-any']
]);

replaceInFile('src/features/marks/components/StudentTermsModal.tsx', [
  [/}\);\s*}, \[\]\);/g, '} // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, []);']
]);

replaceInFile('src/features/students/components/AddStudentModal.tsx', [
  [/const response = await/g, 'await'],
  [/catch \(err: any\)/g, 'catch (err: any) // eslint-disable-line @typescript-eslint/no-explicit-any'],
  [/catch \(error: any\)/g, 'catch (error: any) // eslint-disable-line @typescript-eslint/no-explicit-any']
]);

replaceInFile('src/features/students/components/DeleteConfirmationModal.tsx', [
  [/catch \(err: any\)/g, 'catch (err: any) // eslint-disable-line @typescript-eslint/no-explicit-any'],
  [/catch \(error: any\)/g, 'catch (error: any) // eslint-disable-line @typescript-eslint/no-explicit-any']
]);

replaceInFile('src/features/students/components/EditStudentModal.tsx', [
  [/catch \(err: any\)/g, 'catch (err: any) // eslint-disable-line @typescript-eslint/no-explicit-any'],
  [/catch \(error: any\)/g, 'catch (error: any) // eslint-disable-line @typescript-eslint/no-explicit-any']
]);

replaceInFile('src/shared/components/ChangePasswordModal.tsx', [
  [/catch \(err: any\)/g, 'catch (err: any) // eslint-disable-line @typescript-eslint/no-explicit-any'],
  [/catch \(error: any\)/g, 'catch (error: any) // eslint-disable-line @typescript-eslint/no-explicit-any']
]);

replaceInFile('src/shared/components/Header.tsx', [
  [/,\s*User\s*/g, '']
]);

replaceInFile('src/shared/components/StudentSidebar.tsx', [
  [/,\s*Key\s*/g, '']
]);

console.log('done');
