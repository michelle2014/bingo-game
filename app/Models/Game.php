<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $fillable = ['name_id', 'button_presses', 'marked_count', 'score'];

    public function name()
    {
        return $this->belongsTo(Name::class);
    }
}
