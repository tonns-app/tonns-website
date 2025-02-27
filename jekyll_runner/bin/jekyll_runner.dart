import 'dart:io';

final contentTypes = <String, ContentType>{
  'html': ContentType.html,
  'json': ContentType.json,
  'txt': ContentType.json,
  'css': ContentType('text', 'css'),
  'js': ContentType('text', 'javascript'),
  'png': ContentType('image', 'png'),
  'jpg': ContentType('image', 'jpeg'),
  'jpeg': ContentType('image', 'jpg'),
  'webp': ContentType('image', 'webp'),
  'ttf': ContentType('font', 'ttf'),
  'svg': ContentType('image', 'svg+xml'),
};

Future<void> serve(String dir) async {
  final baseDir = '$dir/_site';

  final server = await HttpServer.bind('localhost', 8080);
  print('Serving files from $baseDir on http://localhost:8080/');

  await for (final request in server) {
    var filePath = baseDir + request.uri.path;
    if (filePath.endsWith('/')) {
      filePath += 'index.html';
    }

    final file = File(filePath);
    if (await file.exists()) {
      request.response
        ..headers.contentType = contentTypes[filePath.split('.').last]
        ..add(await file.readAsBytes())
        ..close();
    } else {
      request.response
        ..statusCode = HttpStatus.notFound
        ..write('404 Not Found')
        ..close();
    }
  }
}

Future<void> _actuallyRebuild(String dir) async {
  final result = await Process.run(
    'jekyll',
    ['build'],
    workingDirectory: dir,
  );
  if (result.stdout != null) {
    stdout.writeln(result.stdout);
  }
  if (result.stderr != null) {
    stderr.writeln(result.stderr);
  }
  print('Finished with exit code: ${result.exitCode}');
}

Future<void> rebuild(String dir) async {
  await _actuallyRebuild(dir);

  final stream = Directory(dir).watch(recursive: true);
  int count = 0;
  await for (final event in stream) {
    if (!event.path.contains('_site') &&
        !event.path.contains('.jekyll-cache')) {
      print('Rebuilding with: jekyll (${++count})');
      await _actuallyRebuild(dir);
    }
  }
}

Future<void> main(List<String> args) async {
  final dir = args.length == 1 ? args.first : '.';
  print('Start directory: $dir');

  rebuild(dir);
  serve(dir);
}
