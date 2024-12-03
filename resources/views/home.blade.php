<div>Home page</div>
@foreach ($posts as $post)
  <p>This is post {{ $post->id }}</p>
@endforeach
