require 'awesome_print'

AwesomePrint.defaults = {
  indent: 2,
  index:  false,
}

LANGUAGES = {
  ruby: "Ruby",
  js:   "JavaScript"
}

task :generate_index_files, [:lang] => [] do |t, args|
  language_codes(args).each do |code|
    Dir.chdir('content') do
      script_files = FileList["**/script.#{code}.adoc"]

      File.open("./index-files.#{code}.adoc", "w") do |f|
        script_files.each { |file_name|
          f << "include::#{file_name}[]\n\n"

          questions_file_name = File.join(File.dirname(file_name), "questions.adoc")
          if File.exist?(questions_file_name)
            f << "include::#{questions_file_name}[]\n\n"
          end
        }
      end
    end
  end
end

task :html, [:lang] => [:generate_script_files, :generate_index_files] do |t, args|
  require 'asciidoctor'

  FileUtils.rm_rf Dir.glob('public/*.html')

  language_codes(args).each do |code|
    puts "Generating #{code}"
    Asciidoctor.convert_file "content/index.#{code}.adoc",
                             safe: :safe,
                             to_file: "public/#{code}/index.html",
                             mkdirs: true,
                             attributes: { 'shots' => ENV['shots'] }
  end

  Dir.chdir('content') do
    File.open("./languages.adoc", "w") do |f|
      LANGUAGES.each do |lang, name|
        f << "- link:#{lang}/index.html[#{name} Version]\n"

      end
    end
  end

  Asciidoctor.convert_file "content/index.adoc",
                           safe: :safe,
                           to_file: "public/index.html",
                           mkdirs: true,
                           attributes: { 'shots' => ENV['shots'] }
end

task :list do
  puts "Available languages: \n"

  LANGUAGES.each do |code, name|
    puts " rake \"html[#{lang}]\"  # Generate HTML for #{name} version."
  end
end

task :generate_script_files do
  FileList["content/*/*/"].each do |dir|
    Dir.chdir(dir) do
      FileUtils.touch("script.adoc") unless File.exist?("script.adoc")

      LANGUAGES.keys.each do |lang_code|
        file_name = "script.#{lang_code}.adoc"
        unless File.exist?(file_name)
          File.open(file_name, "w") do |f|
            f << "include::script.adoc[]\n"
          end
        end
      end
    end
  end
end

task :default => :html

def language_codes(args)
  Array(args[:lang] || LANGUAGES.keys)
end

require 'asciidoctor'
require 'asciidoctor/extensions'

class ShotInlineMacro < Asciidoctor::Extensions::InlineMacroProcessor
  use_dsl

  named :shot

  def process parent, target, attrs
    doc = parent.document
    return unless doc.attributes['shots']
    %(<span style="border-radius: 10px; padding: 2px 5px 2px 5px; color: white; font-weight: bold; background-color: red; font-family: sans-serif;">Shot</span>)
  end
end

Asciidoctor::Extensions.register do
  inline_macro ShotInlineMacro if document.basebackend? 'html'
end