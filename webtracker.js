$(function () { // jQuery DOM ready and variable encapsulation
  var midiOut
  var channelStart = 0
  var channelEnd = 15
  var keyStart = 0
  var keyEnd = 127
  navigator.requestMIDIAccess().then(
    function (midi) {
      var selectMidiOut = $('#midiOut')
      var divChannel = $('#channel')
      var keyboard = $('#keyboard')
      console.log('HELLO MIDI')
      selectMidiOut.empty()
      selectMidiOut.change(function (ev) {
        midiOut = midi.outputs.get(ev.target[ev.target.selectedIndex].value)
      })
      for (var output of midi.outputs.values()) {
          selectMidiOut.append(new Option(output.name, output.id, true, true))
      }
      selectMidiOut.change()
      keyboard.empty()
      for (var key = keyStart; key <= keyEnd; key++) {
        $(document.createElement('div')).attr('id', 'key' + key).appendTo(keyboard)
      }
      keyboard.children().hover(
        function (ev) {
          var key = $(ev.target).index()
          divChannel.find('input:checkbox:checked').each(function (i, el) {
            midiOut.send([0x90 | el.value & 0x0F, key, 0x7F])
          })
        },
        function (ev) {
          var key = $(ev.target).index()
          divChannel.find('input:checkbox:checked').each(function (i, el) {
            midiOut.send([0x80 | el.value & 0x0F, key, 0x7F])
          })
        })
    },
    function (msg) {
      $('#keyboard').hide()
      $('#nomidi').show()
    })
})
