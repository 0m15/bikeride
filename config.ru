use Rack::Deflater
use Rack::Static, 
  :urls => ["/partials", "/js", "/img", "/css"],
  :root => "public"

run lambda { |env|
  [
    200,
    {
      'Content-Type'  => 'text/html', 
      'Cache-Control' => 'public, max-age=86400' 
    },
    File.open('public/index.html', File::RDONLY)
  ]
}

map "/cache.manifest" do
  run lambda { |env|
  [
    200, 
    {
      'Content-Type'  => 'text/cache-manifest', 
      'Cache-Control' => 'public, max-age=86400' 
    },
    File.open('public/cache.manifest', File::RDONLY)
  ]
}
end
